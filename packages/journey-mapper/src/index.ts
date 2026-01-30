/**
 * Journey Mapper
 *
 * Correlates Google Takeout location data with product deaths
 * to generate "Where were you when X died?" narratives
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ProductDeath {
  name: string;
  date: string; // YYYY-MM-DD
  description?: string;
}

interface LocationPoint {
  latitude: number;
  longitude: number;
  placeName?: string;
  address?: string;
  timestamp?: Date;
}

interface JourneyEvent {
  product: string;
  deathDate: string;
  location?: LocationPoint;
  narrative: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// KILLED PRODUCTS (with dates)
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
// LOCATION PARSERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse Semantic Location History (if user has it)
 * Path: Takeout/Location History/Semantic Location History/YYYY_MONTH.json
 */
function parseSemanticLocationHistory(takeoutPath: string): LocationPoint[] {
  const locations: LocationPoint[] = [];
  const historyPath = path.join(takeoutPath, 'Location History', 'Semantic Location History');

  if (!fs.existsSync(historyPath)) {
    return locations;
  }

  const files = fs.readdirSync(historyPath).filter(f => f.endsWith('.json'));

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(historyPath, file), 'utf-8'));

      for (const obj of data.timelineObjects || []) {
        if (obj.placeVisit?.location) {
          const loc = obj.placeVisit.location;
          const duration = obj.placeVisit.duration;

          locations.push({
            latitude: (loc.latitudeE7 || 0) / 1e7,
            longitude: (loc.longitudeE7 || 0) / 1e7,
            placeName: loc.name || loc.address?.split(',')[0],
            address: loc.address,
            timestamp: duration?.startTimestamp ? new Date(duration.startTimestamp) : undefined,
          });
        }
      }
    } catch (e) {
      // Skip malformed files
    }
  }

  return locations.sort((a, b) =>
    (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
  );
}

/**
 * Parse Labelled Places (fallback - no timestamps)
 * Path: Takeout/Maps/My labelled places/Labelled places.json
 */
function parseLabelledPlaces(takeoutPath: string): LocationPoint[] {
  const locations: LocationPoint[] = [];
  const filePath = path.join(takeoutPath, 'Maps', 'My labelled places', 'Labelled places.json');

  if (!fs.existsSync(filePath)) {
    return locations;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const feature of data.features || []) {
      if (feature.geometry?.coordinates) {
        const [lng, lat] = feature.geometry.coordinates;
        locations.push({
          latitude: lat,
          longitude: lng,
          placeName: feature.properties?.name,
          address: feature.properties?.address,
        });
      }
    }
  } catch (e) {
    // Skip if malformed
  }

  return locations;
}

/**
 * Parse Commute Routes (coordinates without timestamps)
 * Path: Takeout/Maps/Commute routes/Commute routes.json
 */
function parseCommuteRoutes(takeoutPath: string): LocationPoint[] {
  const locations: LocationPoint[] = [];
  const filePath = path.join(takeoutPath, 'Maps', 'Commute routes', 'Commute routes.json');

  if (!fs.existsSync(filePath)) {
    return locations;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const trip of data.trips || []) {
      for (const visit of trip.place_visit || []) {
        if (visit.place?.lat_lng) {
          locations.push({
            latitude: visit.place.lat_lng.latitude,
            longitude: visit.place.lat_lng.longitude,
          });
        }
      }
    }
  } catch (e) {
    // Skip if malformed
  }

  return locations;
}

/**
 * Parse Timeline Settings (to get account creation date)
 */
function parseTimelineSettings(takeoutPath: string): { createdTime?: Date; homeLocation?: LocationPoint } {
  const filePath = path.join(takeoutPath, 'Timeline', 'Settings.json');

  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return {
      createdTime: data.createdTime ? new Date(data.createdTime) : undefined,
    };
  } catch (e) {
    return {};
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REVERSE GEOCODING (simple - just identify country/city from coords)
// ═══════════════════════════════════════════════════════════════════════════

function identifyLocation(lat: number, lng: number): string {
  // Simple bounding box checks for known regions
  // In production, use a real geocoding API

  // Vietnam (Da Nang area)
  if (lat > 15 && lat < 17 && lng > 107 && lng < 109) {
    return 'Da Nang, Vietnam';
  }
  // Singapore
  if (lat > 1.2 && lat < 1.5 && lng > 103.6 && lng < 104) {
    return 'Singapore';
  }
  // Bangalore
  if (lat > 12.5 && lat < 13.5 && lng > 77 && lng < 78) {
    return 'Bangalore, India';
  }
  // Indore
  if (lat > 22 && lat < 23 && lng > 75 && lng < 76) {
    return 'Indore, India';
  }
  // Goa
  if (lat > 15 && lat < 16 && lng > 73 && lng < 74) {
    return 'Goa, India';
  }
  // Kerala
  if (lat > 8 && lat < 12 && lng > 75 && lng < 77) {
    return 'Kerala, India';
  }
  // Tamil Nadu
  if (lat > 10 && lat < 11.5 && lng > 78 && lng < 80) {
    return 'Tamil Nadu, India';
  }
  // Delhi/NCR
  if (lat > 28 && lat < 29 && lng > 77 && lng < 78) {
    return 'Delhi NCR, India';
  }

  return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
}

// ═══════════════════════════════════════════════════════════════════════════
// JOURNEY MAPPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Find location on a specific date
 */
function findLocationOnDate(
  targetDate: Date,
  locations: LocationPoint[],
  windowDays: number = 7
): LocationPoint | undefined {
  const targetTime = targetDate.getTime();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  // Find locations within window
  const nearby = locations.filter(loc => {
    if (!loc.timestamp) return false;
    const diff = Math.abs(loc.timestamp.getTime() - targetTime);
    return diff <= windowMs;
  });

  if (nearby.length === 0) return undefined;

  // Return the closest one
  return nearby.sort((a, b) => {
    const diffA = Math.abs((a.timestamp?.getTime() || 0) - targetTime);
    const diffB = Math.abs((b.timestamp?.getTime() || 0) - targetTime);
    return diffA - diffB;
  })[0];
}

/**
 * Build the journey narrative
 */
export function buildJourney(takeoutPath: string): {
  events: JourneyEvent[];
  accountAge?: string;
  locations: LocationPoint[];
  hasTimestamps: boolean;
} {
  // Parse all location sources
  const semanticLocations = parseSemanticLocationHistory(takeoutPath);
  const labelledPlaces = parseLabelledPlaces(takeoutPath);
  const commuteRoutes = parseCommuteRoutes(takeoutPath);
  const settings = parseTimelineSettings(takeoutPath);

  // Determine if we have timestamped data
  const hasTimestamps = semanticLocations.length > 0;

  // Combine all locations
  const allLocations = [...semanticLocations, ...labelledPlaces, ...commuteRoutes];

  // Find home location (first labelled as "Home")
  const homeLocation = labelledPlaces.find(l =>
    l.placeName?.toLowerCase().includes('home')
  );

  // Build events
  const events: JourneyEvent[] = [];

  // Filter deaths to account age
  const accountStart = settings.createdTime || new Date('2010-01-01');
  const relevantDeaths = PRODUCT_DEATHS.filter(d =>
    new Date(d.date) >= accountStart
  );

  for (const death of relevantDeaths) {
    const deathDate = new Date(death.date);
    let location: LocationPoint | undefined;
    let narrative: string;

    if (hasTimestamps) {
      // We have real location history - find where user was
      location = findLocationOnDate(deathDate, semanticLocations);
    }

    if (location?.placeName) {
      narrative = `You were in ${location.placeName} when ${death.name} died.`;
    } else if (location) {
      const placeName = identifyLocation(location.latitude, location.longitude);
      narrative = `You were in ${placeName} when ${death.name} died.`;
      location.placeName = placeName;
    } else if (homeLocation) {
      // Fallback to home location
      narrative = `You were likely in ${homeLocation.placeName || 'your home'} when ${death.name} died.`;
      location = homeLocation;
    } else {
      narrative = `${death.name} died on ${death.date}.`;
    }

    events.push({
      product: death.name,
      deathDate: death.date,
      location,
      narrative,
    });
  }

  return {
    events,
    accountAge: settings.createdTime
      ? `Since ${settings.createdTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      : undefined,
    locations: allLocations,
    hasTimestamps,
  };
}

/**
 * Format journey as printable output
 */
export function formatJourney(journey: ReturnType<typeof buildJourney>): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('╔════════════════════════════════════════════════════════════════╗');
  lines.push('║           🪦 YOUR GOOGLE JOURNEY 🪦                            ║');
  lines.push('╠════════════════════════════════════════════════════════════════╣');

  if (journey.accountAge) {
    lines.push(`║  Account: ${journey.accountAge.padEnd(52)}║`);
  }

  lines.push(`║  Products Killed: ${journey.events.length.toString().padEnd(44)}║`);
  lines.push('╠════════════════════════════════════════════════════════════════╣');

  if (!journey.hasTimestamps) {
    lines.push('║  ⚠️  No location history found - using saved places            ║');
    lines.push('╠════════════════════════════════════════════════════════════════╣');
  }

  for (const event of journey.events) {
    const locName = event.location?.placeName || 'Unknown';
    const emoji = getLocationEmoji(locName);

    lines.push(`║  ${emoji} ${event.deathDate}  ${event.product.padEnd(25)}        ║`);
    lines.push(`║     └─ ${locName.padEnd(54)}║`);
  }

  lines.push('╚════════════════════════════════════════════════════════════════╝');
  lines.push('');

  return lines.join('\n');
}

function getLocationEmoji(location: string): string {
  if (location.includes('Vietnam')) return '🇻🇳';
  if (location.includes('Singapore')) return '🇸🇬';
  if (location.includes('India')) return '🇮🇳';
  if (location.includes('Japan')) return '🇯🇵';
  if (location.includes('USA') || location.includes('Francisco')) return '🇺🇸';
  if (location.includes('UK') || location.includes('London')) return '🇬🇧';
  return '📍';
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  const takeoutPath = process.argv[2] || '/Users/anupamchugh/Downloads/Takeout';

  console.log(`\nScanning: ${takeoutPath}\n`);

  const journey = buildJourney(takeoutPath);
  console.log(formatJourney(journey));

  // Also print unique locations found
  const uniqueLocations = new Set<string>();
  journey.locations.forEach(l => {
    if (l.placeName) {
      uniqueLocations.add(l.placeName);
    } else if (l.latitude && l.longitude) {
      uniqueLocations.add(identifyLocation(l.latitude, l.longitude));
    }
  });

  console.log('Locations found in your Takeout:');
  uniqueLocations.forEach(loc => console.log(`  📍 ${loc}`));
  console.log('');
}
