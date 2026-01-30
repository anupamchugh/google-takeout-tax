/**
 * Timeline View
 *
 * Shows user's location journey with product deaths inserted
 * between trips at the correct chronological position
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface TimelineEntry {
  type: 'location' | 'death';
  date: Date;
  dateStr: string;
  name: string;
  emoji?: string;
  details?: string;
}

interface ProductDeath {
  name: string;
  date: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const PRODUCT_DEATHS: ProductDeath[] = [
  { name: 'Google Reader', date: '2013-07-01' },
  { name: 'Google+', date: '2019-04-02' },
  { name: 'Inbox by Gmail', date: '2019-04-02' },
  { name: 'Google Allo', date: '2019-03-13' },
  { name: 'Google Play Music', date: '2020-12-04' },
  { name: 'Google Hangouts', date: '2022-11-01' },
  { name: 'Google Stadia', date: '2023-01-18' },
  { name: 'Google Podcasts', date: '2024-06-23' },
  { name: 'Notes on Search', date: '2024-07-31' },
];

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION IDENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

function identifyLocation(lat: number, lng: number): { name: string; emoji: string } {
  // Vietnam
  if (lat > 15 && lat < 17 && lng > 107 && lng < 109) {
    return { name: 'Da Nang, Vietnam', emoji: '🇻🇳' };
  }
  // Singapore
  if (lat > 1.2 && lat < 1.5 && lng > 103.6 && lng < 104) {
    return { name: 'Singapore', emoji: '🇸🇬' };
  }
  // Bangalore
  if (lat > 12.5 && lat < 13.5 && lng > 77 && lng < 78) {
    return { name: 'Bangalore, India', emoji: '🇮🇳' };
  }
  // Indore
  if (lat > 22 && lat < 23 && lng > 75 && lng < 76.5) {
    return { name: 'Indore, India', emoji: '🇮🇳' };
  }
  // Goa
  if (lat > 15 && lat < 16 && lng > 73 && lng < 74.5) {
    return { name: 'Goa, India', emoji: '🇮🇳' };
  }
  // Kerala
  if (lat > 8 && lat < 12 && lng > 75 && lng < 77) {
    return { name: 'Kerala, India', emoji: '🇮🇳' };
  }
  // Tamil Nadu
  if (lat > 10 && lat < 11.5 && lng > 78 && lng < 80) {
    return { name: 'Tamil Nadu, India', emoji: '🇮🇳' };
  }
  // Delhi NCR / Gurugram
  if (lat > 28 && lat < 29 && lng > 76.5 && lng < 77.5) {
    return { name: 'Delhi NCR, India', emoji: '🇮🇳' };
  }

  return { name: `Location (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`, emoji: '📍' };
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSE TAKEOUT
// ═══════════════════════════════════════════════════════════════════════════

interface ParsedLocation {
  name: string;
  emoji: string;
  lat: number;
  lng: number;
  date?: Date;
}

function parseTakeout(takeoutPath: string): {
  locations: ParsedLocation[];
  accountCreated?: Date;
} {
  const locations: ParsedLocation[] = [];
  let accountCreated: Date | undefined;

  // 1. Parse Timeline Settings for account age
  const settingsPath = path.join(takeoutPath, 'Timeline', 'Settings.json');
  if (fs.existsSync(settingsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      if (data.createdTime) {
        accountCreated = new Date(data.createdTime);
      }
    } catch {}
  }

  // 2. Parse Labelled Places
  const labelledPath = path.join(takeoutPath, 'Maps', 'My labelled places', 'Labelled places.json');
  if (fs.existsSync(labelledPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(labelledPath, 'utf-8'));
      for (const feature of data.features || []) {
        if (feature.geometry?.coordinates) {
          const [lng, lat] = feature.geometry.coordinates;
          if (lat === 0 && lng === 0) continue; // Skip invalid

          const identified = identifyLocation(lat, lng);
          locations.push({
            name: feature.properties?.name || identified.name,
            emoji: identified.emoji,
            lat,
            lng,
          });
        }
      }
    } catch {}
  }

  // 3. Parse Commute Routes
  const commutePath = path.join(takeoutPath, 'Maps', 'Commute routes', 'Commute routes.json');
  if (fs.existsSync(commutePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(commutePath, 'utf-8'));
      for (const trip of data.trips || []) {
        for (const visit of trip.place_visit || []) {
          if (visit.place?.lat_lng) {
            const lat = visit.place.lat_lng.latitude;
            const lng = visit.place.lat_lng.longitude;
            const identified = identifyLocation(lat, lng);

            // Check if we already have this location
            const exists = locations.some(l => l.name === identified.name);
            if (!exists) {
              locations.push({
                ...identified,
                lat,
                lng,
              });
            }
          }
        }
      }
    } catch {}
  }

  // 4. Parse Semantic Location History (if available)
  const historyPath = path.join(takeoutPath, 'Location History', 'Semantic Location History');
  if (fs.existsSync(historyPath)) {
    try {
      const files = fs.readdirSync(historyPath).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(historyPath, file), 'utf-8'));
        for (const obj of data.timelineObjects || []) {
          if (obj.placeVisit?.location && obj.placeVisit?.duration?.startTimestamp) {
            const loc = obj.placeVisit.location;
            const lat = (loc.latitudeE7 || 0) / 1e7;
            const lng = (loc.longitudeE7 || 0) / 1e7;
            const identified = identifyLocation(lat, lng);

            locations.push({
              name: loc.address || identified.name,
              emoji: identified.emoji,
              lat,
              lng,
              date: new Date(obj.placeVisit.duration.startTimestamp),
            });
          }
        }
      }
    } catch {}
  }

  return { locations, accountCreated };
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD TIMELINE
// ═══════════════════════════════════════════════════════════════════════════

function buildTimeline(
  locations: ParsedLocation[],
  accountCreated?: Date
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const now = new Date();

  // Add account creation
  if (accountCreated) {
    entries.push({
      type: 'location',
      date: accountCreated,
      dateStr: accountCreated.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      name: 'Google Account Created',
      emoji: '🎂',
    });
  }

  // Add unique locations (deduplicate by name)
  const seenLocations = new Set<string>();
  const uniqueLocations = locations.filter(loc => {
    if (seenLocations.has(loc.name)) return false;
    seenLocations.add(loc.name);
    return true;
  });

  // For locations without dates, estimate based on account age
  // Spread them between account creation and now
  const startTime = accountCreated?.getTime() || new Date('2013-01-01').getTime();
  const timeSpan = now.getTime() - startTime;
  const locationCount = uniqueLocations.length;

  uniqueLocations.forEach((loc, i) => {
    const estimatedDate = loc.date || new Date(startTime + (timeSpan * (i + 1)) / (locationCount + 1));

    entries.push({
      type: 'location',
      date: estimatedDate,
      dateStr: loc.date
        ? estimatedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '~' + estimatedDate.toLocaleDateString('en-US', { year: 'numeric' }),
      name: loc.name,
      emoji: loc.emoji,
    });
  });

  // Add product deaths (only after account creation)
  const accountStart = accountCreated || new Date('2010-01-01');
  for (const death of PRODUCT_DEATHS) {
    const deathDate = new Date(death.date);
    if (deathDate >= accountStart) {
      entries.push({
        type: 'death',
        date: deathDate,
        dateStr: deathDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        name: death.name,
        emoji: '💀',
      });
    }
  }

  // Add "Now"
  entries.push({
    type: 'location',
    date: now,
    dateStr: 'Now',
    name: 'Present Day',
    emoji: '📍',
  });

  // Sort by date
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

  return entries;
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

function formatTimeline(entries: TimelineEntry[]): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('              🪦 YOUR GOOGLE JOURNEY TIMELINE 🪦               ');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  let lastType: 'location' | 'death' | null = null;
  let deathBuffer: TimelineEntry[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (entry.type === 'location') {
      // Print any buffered deaths first
      if (deathBuffer.length > 0) {
        for (const death of deathBuffer) {
          lines.push(`│`);
          lines.push(`├── ${death.emoji} ${death.name.padEnd(30)} ${death.dateStr}`);
        }
        deathBuffer = [];
      }

      // Print location
      lines.push(`│`);
      lines.push(`${entry.emoji} ${entry.name}`);
      if (entry.dateStr !== 'Now') {
        lines.push(`   ${entry.dateStr}`);
      }
    } else {
      // Buffer deaths to print before next location
      deathBuffer.push(entry);
    }

    lastType = entry.type;
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════════');

  // Stats
  const deaths = entries.filter(e => e.type === 'death');
  const locations = entries.filter(e => e.type === 'location' && e.name !== 'Google Account Created' && e.name !== 'Present Day');

  lines.push('');
  lines.push(`📊 ${locations.length} places visited | ${deaths.length} products died`);
  lines.push('');

  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

export function generateTimeline(takeoutPath: string): string {
  const { locations, accountCreated } = parseTakeout(takeoutPath);
  const timeline = buildTimeline(locations, accountCreated);
  return formatTimeline(timeline);
}

// CLI
if (require.main === module) {
  const takeoutPath = process.argv[2] || '/Users/anupamchugh/Downloads/Takeout';
  console.log(generateTimeline(takeoutPath));
}
