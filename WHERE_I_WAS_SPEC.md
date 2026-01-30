# Where I Was When: Personal Location Timeline + Service Deaths

**Correlate your personal location history with tech service shutdowns. Visualize your digital history in time and space.**

---

## Vision

When a tech service dies, most people ask: "What happened to my data?"

This asks a more human question: **"Where was I when it died?"**

The result is a personal, poetic timeline of your digital life mapped against the death of the products you used. It turns the graveyard into a memoir.

```
March 22, 2019 - Tokyo, Japan
↓
Google Inbox is killed
↓
You were in Tokyo when Google stopped sending your emails to Inbox
```

---

## Problem

Tech graveyards are abstract—service names, dates, statistics. But we experience products while *living*. This connects:
- **Personal location history** (where you were)
- **Service timeline** (when products died)
- **Your usage** (what you used there)

Result: A story, not a statistic.

---

## Core Feature: Timeline of Death

### The User Journey

```
1. User uploads Google Takeout (or links via OAuth)
2. Asks: "Where was I when Google Inbox died?"
3. System returns:
   - Service shutdown date
   - User's location that week
   - Narrative: "You were in Tokyo"
   - Context: How often user checked Inbox then
4. User browses timeline of all service deaths + their locations
```

### MCP Tools (Zero APIs)

```typescript
// Cross-database query
get_location_during_service(service_name: string) → {
  service: {
    name: string;
    shutdown_date: Date;
    announcement_date?: Date;
    reason: string;
  };
  location_timeline: {
    date: Date;
    place_name: string;
    latitude: number;
    longitude: number;
    accuracy: number; // meters
  }[];
  narrative: string; // "You were in Tokyo for 3 days during this"
  user_stats: {
    days_at_location: number;
    locations_visited_that_week: number;
  };
}

// Generate timeline
get_service_death_timeline_with_locations(
  start_year?: number,
  end_year?: number
) → Array<{
  service: Service;
  shutdown_date: Date;
  user_location?: Location;
  was_traveling: boolean;
  narrative: string;
}>

// Find correlations
find_services_killed_near_location(
  place_name: string,
  radius_km?: number
) → Service[] // Services killed while user was near here
```

---

## Data Models

### Service Death Event

```typescript
interface ServiceDeathEvent {
  service: KilledService;
  user_location: {
    date: Date;
    place_name: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    duration_days: number;
  };
  narrative: {
    short: string; // "You were in Tokyo when Google Inbox died"
    long: string; // Full context paragraph
    emoji: string; // 🇯🇵 📍
  };
  user_context?: {
    was_traveling: boolean;
    distance_from_home_km: number;
    other_services_used_then: string[];
  };
}

interface TimelineEntry {
  date: Date;
  event_type: 'service_death' | 'location_change' | 'both';
  service?: KilledService;
  location?: Location;
  narrative: string;
}
```

---

## Use Cases

### Personal Memoir
"Create my digital memoir - show me the timeline of my life through the products that died while I lived it"

### Nostalgia/Reflection
"What was I doing when Google Reader died?" → Correlate with location, photos from that date

### Awareness
"I didn't realize how many products died while I was traveling in Southeast Asia"

### Social Sharing
Share: "I was in 5 countries when Google killed 12 products"
- Shareable timeline visualization (static image)
- Narrative blurb

---

## Product Angles

### Angle 1: Memoir Generator
*"Your digital life in maps and dates"*
- Generate PDF: "2019-2024: My Timeline of Digital Deaths"
- Include: Where you were, what you were using, what you lost
- Shareable on social media

### Angle 2: Nostalgia Browser
*"When Google killed X, I was in Y"*
- Interactive timeline slider
- Hover over service → see where you were
- Hover over location → see what died there
- "You were here 47 times, and 3 services died while you visited"

### Angle 3: Geo-Memoir
*"Products that died near you"*
- Find closest location to where you were
- "Services killed while you were in Japan"
- Map view: services clustered by location + date

---

## Implementation: Phase 1 (MVP)

### Core Components

1. **Takeout Parser** (from TAKEOUT_MCP_SPEC)
   - Extract location timeline
   - Normalize places

2. **Graveyard Connector** (from SPEC)
   - Load service death dates
   - Service metadata

3. **Correlation Engine**
   ```typescript
   // Core logic
   for each service in graveyard:
     shutdown_date = service.date_close
     locations_during_window = takeout.get_locations(
       shutdown_date - 7 days,
       shutdown_date + 7 days
     )
     if locations_during_window:
       create ServiceDeathEvent
   ```

4. **Narrative Generator**
   - Simple templates: "You were in {place} when Google killed {service}"
   - More complex: "You visited {place} {n} times, and {m} services died then"

5. **CLI Output**
   ```
   🪦 YOUR DIGITAL GRAVEYARD TIMELINE
   
   Jan 2013 - San Francisco, CA
   └─ Google Reader killed
      You were home when this happened
      
   Mar 2019 - Tokyo, Japan
   └─ Google Inbox killed
      You were traveling. 47 days away from home.
      
   May 2020 - Remote (Various)
   └─ Google Play Music killed
      You were between cities.
   ```

### Zero APIs
- Takeout parser: local JSON ✓
- Graveyard data: local database ✓
- Correlation: simple date matching ✓
- Output: CLI or GeoJSON export ✓

### Tech Stack
- **Language**: Node.js + TypeScript
- **Parsing**: Takeout Timeline MCP
- **DB**: Graveyard PostgreSQL
- **Output**: JSON, GeoJSON, Markdown, CLI

---

## Phase 2: Visualization & Sharing

### Timeline Visualization
- Leaflet map (free, no API)
- Timeline slider
- Hover/click for details

### Shareable Artifacts
- Static image: "Timeline of my digital deaths"
- GeoJSON: upload to Google My Maps / Felt
- PDF report: "My 2019-2024 Digital Graveyard"

### Social Sharing
```
"I was in 12 countries when Google killed 8 products.
Here's my Timeline of Death 💀📍"

[Timeline image]
[Link to interactive version]
```

---

## Narrative Examples

### Simple
```
You were in Tokyo when Google Inbox died (March 22, 2019)
```

### Rich
```
On March 22, 2019, Google killed Inbox. You were in Tokyo, Japan.
You'd been there for 4 days, visiting during cherry blossom season.
You checked Inbox 14 times that week before it disappeared.
```

### Emotional
```
Google Play Music died on December 1, 2020.
You were home in San Francisco—back from a 3-month trip through Europe.
Your Takeout export shows 847 songs. You'll never access them the same way again.
```

---

## Data Privacy

**User data never leaves their machine (unless they export)**
- Parse local Takeout JSON ✓
- Query local/secure database ✓
- Output as file/JSON ✓
- Optional: Share anonymized summary

---

## Success Metrics

- Users who upload Takeout
- Timeline correlations found
- Shared narratives / social posts
- "Aha" moments (surprising coincidences)

---

## Why This Is Different

Most graveyard tools ask: "What services died?"
This asks: "Where was I? What was I doing? How did it affect my life?"

It's personal. It's visual. It's a story.

---

## Tech Stack (Phase 1)

- **Parser**: Node.js + TypeScript (Takeout)
- **Database**: PostgreSQL (Graveyard)
- **Correlation**: Simple date/location matching
- **Output**: CLI, JSON, Markdown, GeoJSON
- **MCP**: Node.js MCP SDK

---

## Repository Integration

Part of `graveyard/` monorepo:

```
graveyard/
├── packages/
│   ├── db/
│   │   └── schema.ts (KilledService + Location)
│   ├── takeout-parser/
│   │   └── locations.ts
│   └── correlation-engine/
│       └── where-i-was.ts
├── tools/
│   └── where-i-was-cli.ts
└── mcp/
    └── where-i-was-tools.ts
```

---

## How to Get Your Data Started

### Exporting Google Takeout

Follow the step-by-step guide in [TAKEOUT_MCP_SPEC.md](./TAKEOUT_MCP_SPEC.md#how-to-get-your-google-takeout-export):

1. Go to [takeout.google.com](https://takeout.google.com)
2. Select "Location History" only
3. Download as JSON
4. Wait for email (5-30 min)
5. Extract ZIP file

Result: Folder with `2024_JANUARY.json`, `2024_FEBRUARY.json`, etc.

### What You Get

Your location data with timestamps:
```json
{
  "locations": [
    {
      "latitudeE7": 356762000,
      "longitudeE7": 1396503000,
      "accuracy": 50,
      "timestampMs": "1553212800000",
      "placeName": "Tokyo, Japan"
    }
  ]
}
```

This is plugged into the correlation engine to match service death dates.

---

## Next Steps

1. Build Takeout import script (Phase 2)
2. Implement correlation engine (cross-query Graveyard + Takeout)
3. Build narrative generator (templates → stories)
4. CLI tool for timeline output
5. Export as JSON/GeoJSON
6. Optional: Simple web UI to browse timeline
7. Share feature (static image generator)
