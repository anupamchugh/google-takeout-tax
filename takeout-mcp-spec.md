# Takeout Tax MCP Server - Spec

## Overview

An MCP server that scans local Google Takeout exports and cross-references with the Google Graveyard database to calculate your personal "Takeout Tax."

**Privacy-first**: All processing happens locally. No data leaves your machine.

---

## Tools

### `scan_takeout`

Scans a Google Takeout folder and identifies products used.

```typescript
scan_takeout(path: string): {
  products: ProductScan[];
  accountAge: string;
  totalSize: string;
}

interface ProductScan {
  folder: string;
  status: 'dead' | 'alive' | 'at_risk' | 'unknown';
  fileCount: number;
  sizeBytes: number;
  oldestData: Date;
  newestData: Date;
}
```

**Example:**
```
User: "Scan my Takeout folder at ~/Downloads/Takeout"

Claude: [calls scan_takeout("~/Downloads/Takeout")]

Response: "Found 15 Google products in your Takeout:
- 3 dead products (Google+, Play Music, Hangouts)
- 10 alive products (Gmail, Drive, Photos...)
- 2 at-risk products (Keep, Google Chat)

Your Google account dates back to December 2013."
```

---

### `calculate_tax`

Calculates your personal Takeout Tax based on scanned products.

```typescript
calculate_tax(
  path: string,
  hourlyRate?: number  // default $50
): TakeoutTaxReport

interface TakeoutTaxReport {
  // Summary
  accountAge: string;
  productsUsed: number;
  productsKilled: number;

  // Dead products detail
  deadProducts: {
    name: string;
    diedOn: string;
    yourDataFrom: string;  // date range
    migrationHours: number;
    whatYouLost: string;
    whatYouMigratedTo?: string;
  }[];

  // Tax calculation
  totalMigrationHours: number;
  opportunityCost: number;
  subscriptionsCost: number;  // annual
  dataLossPercent: number;

  // Fun stats
  timesGoogled: number;
  worseThan: string;  // "85% of users"
}
```

**Example:**
```
User: "Calculate my Takeout Tax"

Claude: [calls calculate_tax("~/Downloads/Takeout", 75)]

Response: "
💀 YOUR TAKEOUT TAX INVOICE

Account: Since December 2013 (11 years)
Products Killed: 4

❌ Google+ (died 2019)
   Your data: 2014-2019 (5 years of posts)
   Migration: 4 hours
   Lost: Circle connections, comments on posts

❌ Play Music (died 2020)
   Your data: 2015-2020 (uploaded library)
   Migration: 6 hours
   Lost: Playlists organization, radio stations
   Migrated to: YouTube Music

❌ Hangouts (died 2022)
   Your data: 2013-2022 (9 years of chats)
   Migration: 3 hours
   Lost: Some chat history gaps

❌ Google Podcasts (died 2024)
   Your data: 2020-2024
   Migration: 1 hour
   Migrated to: Pocket Casts

TOTAL TAX:
⏱️  Migration Hours: 14
💰 Opportunity Cost: $1,050 (at $75/hr)
📉 Data Loss Risk: 35%

You've been Googled 4 times. That's worse than 72% of users."
```

---

### `death_watch`

Shows products in your Takeout that are at risk of dying.

```typescript
death_watch(path: string): AtRiskProduct[]

interface AtRiskProduct {
  name: string;
  folder: string;
  riskScore: number;  // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  yourDataSize: string;
  signals: string[];
  alternatives: string[];
  exportNow: boolean;  // recommend immediate backup
}
```

**Example:**
```
User: "What products in my Takeout might die?"

Claude: [calls death_watch("~/Downloads/Takeout")]

Response: "⚠️ DEATH WATCH for your Google data:

🔴 HIGH RISK
• Google Keep (73% risk)
  You have: 847 notes, 12MB
  Signals: No monetization, competing with Docs
  Export now: Yes
  Alternatives: Notion, Obsidian, Apple Notes

🟡 MEDIUM RISK
• Google Chat (52% risk)
  You have: 3 years of messages
  Signals: Competing with Meet, Spaces confusion
  Alternatives: Slack, Discord

🟢 LOW RISK
• Gmail, Drive, Photos - Core products, safe"
```

---

### `product_obituary`

Get details about a specific dead product and your data in it.

```typescript
product_obituary(
  path: string,
  productName: string
): ProductObituary

interface ProductObituary {
  name: string;
  born: string;
  died: string;
  lifespan: string;
  description: string;
  peakUsers: string;
  causeOfDeath: string;

  // Your personal data
  yourData: {
    dateRange: string;
    fileCount: number;
    size: string;
    highlights: string[];  // "4,521 photos", "127 posts"
  };

  // Memorial
  lastWords: string;  // Funny epitaph
  rip: string;        // "RIP Google Reader, you were too good for this world"
}
```

---

## Resources

### `takeout://products`

List all products found in the scanned Takeout folder.

### `takeout://dead`

List only dead products with your data.

### `takeout://timeline`

Timeline of your Google product usage vs product deaths.

```
2013 ──┬── Account created
       │   ├── Gmail ✅
       │   └── Drive ✅
2014 ──┼── Started using Google+
2015 ──┼── Started using Play Music
       │
2019 ──┼── 💀 Google+ died (you lost 5 years of data)
       │   💀 Inbox by Gmail died
2020 ──┼── 💀 Play Music died (migrated to YT Music)
2022 ──┼── 💀 Hangouts died
2024 ──┼── 💀 Google Podcasts died
       │
NOW  ──┴── 4 products killed, 10 surviving
```

---

## Implementation

### Folder → Product Mapping

```typescript
const TAKEOUT_FOLDER_MAP: Record<string, string> = {
  // Dead products
  'Google+ Stream': 'google-plus',
  'Google Play Music': 'google-play-music',
  'Hangouts': 'hangouts',
  'Google Podcasts': 'google-podcasts',
  'Inbox': 'inbox-by-gmail',
  'Stadia': 'stadia',
  'Google Allo': 'google-allo',
  'Google Reader': 'google-reader',

  // Alive products
  'Mail': 'gmail',
  'Drive': 'google-drive',
  'Photos': 'google-photos',
  'Maps': 'google-maps',
  'YouTube': 'youtube',
  'Chrome': 'google-chrome',
  'Calendar': 'google-calendar',
  'Contacts': 'google-contacts',
  'Keep': 'google-keep',
  'Tasks': 'google-tasks',
  'Fit': 'google-fit',
  'Home': 'google-home',
  'Voice': 'google-voice',

  // At risk
  'Google Chat': 'google-chat',
};
```

### Tech Stack

- **Runtime**: Node.js / Bun
- **MCP SDK**: @modelcontextprotocol/sdk
- **File parsing**: Native fs, JSON parsing
- **Data source**: Local graveyard.json (from killedbygoogle)

### Privacy

- **100% local processing**
- No network calls during scan
- No telemetry
- User's Takeout data never leaves their machine
- Only folder names and file metadata are processed (not file contents)

---

## Example Session

```
Human: I downloaded my Google Takeout. Can you scan it?

Claude: I'll scan your Takeout folder. Where is it located?