# Takeout Timeline MCP: Extract & Visualize Google Data

**Extract personal data from Google Takeout exports. Visualize location timelines, service usage patterns, and data correlations.**

## Vision

Bridge personal Google data with the graveyard database. When a service dies, users can:
- See their exact usage during that service's lifetime
- Export data before shutdown
- Understand what they're losing
- Visualize their digital history overlaid with service death dates

Example: "You walked through Tokyo while Google Inbox was dying" with heatmap + timeline.

## Problem

Google Takeout gives you raw data dumps (JSON files). Users need:
- Parsed, queryable access to their own data
- Timeline visualization (where was I, what did I use, when)
- Correlation with graveyard events (service death dates)
- Easy extraction via MCP for automation

## Scope

### Phase 1: Maps Timeline

Extract location data from Google Takeout → queryable timeline

```
Data sources:
├── Semantic Location History (JSON)
├── Timeline (JSON)
└── Google Maps visits + places

Outputs:
├── Location timeline (date, lat/lng, place name, duration)
├── Movement heatmap (density by location)
├── Places visited catalog
└── MCP tools for querying
```

### Phase 2: Full Takeout Parser (Optional MVP+)

Extend to parse:
- Gmail (email counts, contacts, labels over time)
- Google Drive (docs/files created/modified timeline)
- YouTube (watch history, subscriptions)
- Google Photos (photo dates, albums)
- Chrome bookmarks/history
- Search history

## Data Models

### Maps Timeline Entry

```typescript
interface LocationTimelineEntry {
  id: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  altitude?: number;
  speed?: number;
  heading?: number;
  placeId?: string;
  placeName?: string;
  address?: string;
  placeType?: string; // home, work, visited_place
  duration_ms?: number; // time spent at location
  confidence?: number; // 0-100
}

interface Heatmap {
  grid: Array<{
    lat: number;
    lng: number;
    intensity: number; // visits/density
  }>;
  center: { lat: number; lng: number };
  zoom_levels: Record<number, Heatmap>;
}

interface PlaceVisit {
  placeId: string;
  placeName: string;
  address: string;
  placeType: string;
  visited_at: Date;
  duration_ms: number;
  visit_count: number;
  last_visited: Date;
}

interface TakeoutExport {
  user_id: string;
  exported_at: Date;
  data_types: string[]; // ['maps', 'gmail', 'drive', 'photos', etc]
  date_range: {
    start: Date;
    end: Date;
  };
  size_bytes: number;
}
```

## MCP Tools (Phase 1)

```typescript
tools:
  // Basic timeline queries
  - get_location_timeline(
      start_date: Date,
      end_date: Date,
      min_duration_ms?: number
    ) → LocationTimelineEntry[]

  - get_places_visited(
      limit?: number,
      place_type?: string
    ) → PlaceVisit[]

  - get_place_by_id(place_id: string) → PlaceVisit

  // Correlation with graveyard
  - get_timeline_during_service(
      service_name: string,  // e.g., "Google Inbox"
      graveyard_db: Database
    ) → {
        timeline_entries: LocationTimelineEntry[];
        service_status: {
          announcement_date: Date;
          shutdown_date: Date;
          user_activity_before: number; // messages sent, etc
          user_activity_after: number;
        }
      }

  // Visualization
  - get_heatmap(
      start_date?: Date,
      end_date?: Date
    ) → Heatmap

  - get_movement_summary(
      start_date: Date,
      end_date: Date
    ) → {
        total_distance_km: number;
        unique_locations: number;
        most_visited_place: PlaceVisit;
        movement_pattern: string; // "nomadic" | "settled" | "traveling"
      }

  - get_timeline_stats(
      start_date?: Date,
      end_date?: Date
    ) → {
        days_tracked: number;
        locations_recorded: number;
        coverage_percentage: number;
        gaps: Array<{start: Date, end: Date}>;
      }
```

## Implementation Flow

### 1. Takeout Upload/Parse

User provides Takeout export (JSON files):
```
takeout-export/
├── Semantic Location History/
│   └── 2024_JANUARY.json
├── Timeline/
│   └── 2024_JANUARY.json
└── [other services]/
```

Parser extracts location data, normalizes timestamps, dedupes, stores in local DB.

### 2. MCP Server

Node.js server with tools above, connects to local SQLite or user's own DB.

### 3. Integration with Graveyard

When querying graveyard for a service:
- Fetch service death dates
- Query Takeout timeline during that period
- Show user activity correlation
- Enable "export before death" workflow

## Data Privacy & Storage

**Critical constraints:**
- Data never leaves user's machine (unless explicitly exported)
- Optional: Store in user's own cloud (S3, etc via signed URLs)
- MCP server runs locally by default
- No server component tracking personal location data

## Database Schema (Phase 1)

```sql
CREATE TABLE location_timeline (
  id UUID PRIMARY KEY,
  user_id UUID,
  timestamp TIMESTAMP NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy INT,
  place_id VARCHAR,
  place_name VARCHAR,
  address VARCHAR,
  duration_ms INT,
  confidence INT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_timestamp (user_id, timestamp)
);

CREATE TABLE place_visits (
  id UUID PRIMARY KEY,
  user_id UUID,
  place_id VARCHAR UNIQUE,
  place_name VARCHAR,
  address VARCHAR,
  place_type VARCHAR,
  visit_count INT DEFAULT 1,
  total_duration_ms BIGINT DEFAULT 0,
  first_visited TIMESTAMP,
  last_visited TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE takeout_exports (
  id UUID PRIMARY KEY,
  user_id UUID,
  exported_at TIMESTAMP,
  data_types JSONB,
  date_range_start TIMESTAMP,
  date_range_end TIMESTAMP,
  size_bytes BIGINT,
  status ENUM ('processing', 'complete', 'error'),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Phase 1 MVP Deliverables (Zero APIs)

1. **Takeout parser** - Extract Maps JSON, normalize, dedupe (NO APIs)
2. **Local MCP server** - Node.js with core tools (NO APIs)
3. **Integration layer** - Connect to graveyard database (NO APIs)
4. **CLI tool** - Query timelines from command line (NO APIs)
5. **Documentation** - How to export + use (NO APIs)

### Why No APIs?
- Parses local JSON files from user's Takeout export
- Runs on user's machine (privacy-first)
- Zero external dependencies = instant deployment
- Works offline
- Integrates seamlessly with Graveyard MCP

---

## How to Get Your Google Takeout Export

### Step-by-Step Instructions

1. **Go to Google Takeout**
   - Visit [takeout.google.com](https://takeout.google.com)
   - Sign in with your Google account

2. **Select Location History**
   - Click "Deselect all" (at top)
   - Scroll down and find "Location History"
   - Check the box next to it
   - Leave everything else unchecked

3. **Configure Export**
   - Click "Next step" (bottom)
   - Choose delivery method:
     - **Download link** (fastest - get ZIP via email in 5-30 min)
     - Add to Google Drive
     - Add to Dropbox/OneDrive/Box
   - Choose file format: **JSON** (not KML)

4. **Create & Download**
   - Click "Create export"
   - Wait for email with download link
   - Download the ZIP file

5. **Extract & Locate Data**
   ```
   Takeout/
   └── Location History/
       └── Semantic Location History/
           ├── 2024_JANUARY.json
           ├── 2024_FEBRUARY.json
           ├── 2024_MARCH.json
           └── ... (one file per month)
   ```

### What's Inside the JSON Files?

Each month's JSON file contains:
```json
{
  "locations": [
    {
      "latitudeE7": 356762000,
      "longitudeE7": 1396503000,
      "accuracy": 50,
      "timestampMs": "1553212800000",
      "placeName": "Tokyo, Japan"
    },
    ...
  ]
}
```

**Important**: Google stores coordinates as integers multiplied by 1e7 (the parser handles this automatically)

### Privacy Note

- Google Takeout is YOUR data
- Download stays on your machine
- Parser runs locally
- No data sent to servers
- You control what happens to it

### Troubleshooting

**"Location History" not available?**
- Make sure Location History is enabled on your Google account
- Go to [myactivity.google.com/location](https://myactivity.google.com/location)
- Enable "Location settings"

**Export takes too long?**
- Google may take 5-30 minutes to prepare
- Check your email for a download link

**How much data?**
- Depends on how long you've had Location History enabled
- Typical: 100MB-5GB for 5+ years
- Parser can handle this fine on modern machines

## Phase 2+ (Optional)

- Multi-service parser (Gmail, Drive, YouTube, etc)
- Web UI for visualization
- Heatmap rendering (Mapbox/Google Maps API)
- Movement pattern ML (detect travels, routine locations)
- Export reports (PDF timeline + graveyard correlations)
- Browser extension widget showing "risk score" for current services

## Tech Stack

- **Parser**: Node.js + TypeScript
- **DB**: SQLite (local) or PostgreSQL (if cloud)
- **MCP Server**: Node.js MCP SDK
- **Optional Web/CLI**: Next.js or Remix
- **Visualization** (Phase 2): Mapbox GL, D3.js

## Success Metrics

- Parses full Takeout in <5 seconds
- Query timeline over 5 years in <100ms
- Accurate place detection (90%+ match with Google's data)
- Users can export "my data during [service lifetime]" in 1 click
- 1000+ users extract data before service shutdown

## Security & Compliance

- User data encrypted at rest (optional)
- No tracking/analytics on personal locations
- Clear license: data deletion after processing
- GDPR/CCPA compliant (user owns data)
- Optional: Air-gapped mode (no network)

## Next Steps

1. Build Takeout parser (Google Maps JSON format)
2. Create local SQLite schema + import
3. Develop MCP server with Phase 1 tools
4. Test correlation with graveyard database
5. Write export format (GeoJSON for locations)
