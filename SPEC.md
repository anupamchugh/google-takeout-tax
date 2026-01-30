# Graveyard: Tech Service Graveyard Database + MCP

**Scraping and cataloging dead/killed tech services.**

---

## The Parody That Writes Itself

> "Google Takeout: Export your memories before we delete them."
>
> "Google Notes: A service for leaving notes on search results. Status: Dead. Users told to use Takeout to export their notes about... other dead products."

The tech graveyard is both tragedy and comedy. This project embraces both - a serious tool with a dark sense of humor about platform impermanence.

**Taglines:**
- "Don't get attached."
- "Calculating your Takeout Tax since 2024"
- "Part obituary, part invoice"
- "Google Hospice: We'll tell you when it's time"

---

## Vision

Comprehensive database of tech services that have been shut down or killed, with data preservation metadata. Users can search for services, find shutdown timelines, discover preservation options, and access archived data.

**Unique angle: The Takeout Tax Calculator** - Quantify the hidden cost of platform deaths.

### Delivery Formats
- **MCP server** (Claude/AI integration)
- **Web app** (public browsing + calculator)
- **iOS app** (widget + death watch alerts)
- **Redash dashboards** (visual exploration)
- **Browser extension** (warns on new Google products)

---

## Core Problem

When tech services die:
- Users lose access to their data
- Documentation disappears
- Historical record gets fragmented across archives
- No centralized place to learn about preservation options
- **Nobody tracks the cumulative cost to users**

---

## The Takeout Tax Calculator

### What Is It?

A tool that calculates the hidden cost you've paid every time a tech company kills a product you used.

### The Real Costs Nobody Tracks

| Cost Type | Description | Example |
|-----------|-------------|---------|
| **Export Time** | Hours spent in Google Takeout, downloading ZIPs | 2 hrs for Google+ photos |
| **Research Time** | Finding alternatives, reading comparisons | 3 hrs finding Feedly after Reader |
| **Migration Time** | Importing data, setting up new service | 4 hrs moving playlists to Spotify |
| **Learning Curve** | Getting productive with replacement | 5 hrs learning new podcast app |
| **Subscription Fees** | Paid alternatives to free Google services | $10/mo for podcast hosting |
| **Data Loss** | Content that couldn't be exported | 15% of Hangouts history |
| **Opportunity Cost** | What you could've done instead | $50/hr × total hours |
| **Trust Erosion** | Hesitancy to adopt new platform features | Priceless (or -$∞) |

### Calculator Interface

```
┌─────────────────────────────────────────────────────────────────┐
│                    💀 TAKEOUT TAX CALCULATOR 💀                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Which killed products did you use?                             │
│                                                                 │
│  GOOGLE (147 dead)                                              │
│  ☑ Google Reader (2013)      ☑ Google+ (2019)                  │
│  ☑ Inbox by Gmail (2019)     ☑ Google Play Music (2020)        │
│  ☑ Google Stadia (2023)      ☑ Google Podcasts (2024)          │
│  ☐ Hangouts (2022)           ☐ Google Domains (2023)           │
│                                                                 │
│  MICROSOFT (43 dead)                                            │
│  ☐ Windows Phone             ☐ Mixer                           │
│  ☐ Cortana (consumer)        ☐ Internet Explorer               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💼 Your hourly rate: [$50____]                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  YOUR TAKEOUT TAX INVOICE:                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⏱️  Total Hours Lost:           47.5 hrs                │   │
│  │ 💰 Opportunity Cost:            $2,375                  │   │
│  │ 💸 New Subscriptions:           $156/year               │   │
│  │ 📉 Estimated Data Lost:         ~12%                    │   │
│  │ 🔄 Products Migrated:           8                       │   │
│  │ 😤 Trust Score Impact:          -34 points              │   │
│  │                                                         │   │
│  │ ════════════════════════════════════════════════════   │   │
│  │ 📊 TOTAL LIFETIME TAX:          $3,891                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🏆 You've been "Googled" 8 times since 2013                    │
│  📈 Top 15% of affected users                                   │
│  ⚠️  3 products you use are showing warning signs               │
│                                                                 │
│  [Share Invoice] [Download PDF] [See Death Watch]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Death Watch (Risk Predictor)

Based on patterns from 400+ product deaths, predict which current products are at risk:

**Risk Signals:**
- Low adoption / engagement metrics
- Competing with another internal product
- Leadership changes
- Reduced update frequency
- "Sunset" language appearing in docs
- Integration into larger product (absorption death)
- < 3 years old with no clear monetization

```
┌─────────────────────────────────────────────────────────────────┐
│                      ⚠️ DEATH WATCH ⚠️                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Products You Use That May Die Soon:                            │
│                                                                 │
│  🔴 HIGH RISK (>70% chance by 2027)                             │
│     • Google Keep - 73% - "absorbed into Docs" pattern          │
│     • Google Chat - 68% - competing with Meet, Spaces           │
│                                                                 │
│  🟡 MEDIUM RISK (40-70%)                                        │
│     • Google Fi - 52% - low growth, carrier pressure            │
│     • Waze - 45% - Maps absorbing features                      │
│                                                                 │
│  🟢 PROBABLY SAFE (<40%)                                        │
│     • Gmail - 3% - core product                                 │
│     • YouTube - 1% - cash cow                                   │
│                                                                 │
│  [Set Up Alerts] [Export Contingency Plans]                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Migration Playbooks

Pre-written guides for when products die:

```
┌─────────────────────────────────────────────────────────────────┐
│           📋 MIGRATION PLAYBOOK: Google Podcasts → ???          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: Export Your Data                                       │
│  • Go to takeout.google.com                                     │
│  • Select "Google Podcasts"                                     │
│  • Download OPML file (your subscriptions)                      │
│  • Est. time: 15 minutes                                        │
│                                                                 │
│  STEP 2: Choose Alternative                                     │
│  ┌────────────────┬────────┬──────────┬─────────────┐          │
│  │ App            │ Cost   │ Import   │ Data Compat │          │
│  ├────────────────┼────────┼──────────┼─────────────┤          │
│  │ Pocket Casts   │ $4/mo  │ OPML ✓   │ 95%         │          │
│  │ Overcast       │ Free   │ OPML ✓   │ 90%         │          │
│  │ Spotify        │ Free*  │ Manual   │ 70%         │          │
│  │ Apple Podcasts │ Free   │ OPML ✓   │ 85%         │          │
│  └────────────────┴────────┴──────────┴─────────────┘          │
│                                                                 │
│  STEP 3: Import                                                 │
│  • Open new app → Settings → Import → Select OPML               │
│  • Est. time: 5 minutes                                         │
│                                                                 │
│  ⚠️  WHAT YOU'LL LOSE:                                          │
│  • Play progress on episodes                                    │
│  • Downloaded episodes (re-download needed)                     │
│  • Queue order                                                  │
│                                                                 │
│  Est. Total Migration Time: 45 minutes                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Core Service Schema

```typescript
interface KilledService {
  id: string;                    // UUID
  name: string;                  // "Google Reader"
  slug: string;                  // "google-reader"
  company: Company;              // "google" | "microsoft" | "meta" | ...
  category: Category;            // "communication" | "productivity" | ...

  // Timeline
  dateOpen: Date;                // Launch date
  dateClose: Date;               // Shutdown date
  announcementDate?: Date;       // When death was announced
  lifespanDays: number;          // Computed

  // Context
  description: string;           // What it was
  reasonForShutdown?: string;    // Why it died
  peakUsers?: number;            // At its height

  // Links
  officialLinks: string[];       // Announcements, docs
  redditThreads: string[];       // Community discussions
  newsArticles: string[];        // Coverage

  // Preservation
  preservation: PreservationData;

  // Alternatives
  alternatives: Alternative[];

  // Migration costs (crowdsourced)
  migrationCosts: MigrationCosts;

  // Metadata
  dataSources: string[];
  lastUpdated: Date;
  verified: boolean;
}

interface PreservationData {
  waybackSnapshot?: string;      // Archive.org URL
  archiveStatus: 'complete' | 'partial' | 'limited' | 'none';
  takeoutAvailable: boolean;
  takeoutFormats: string[];      // ["OPML", "JSON", "MBOX"]
  dataRecoveryOptions: string[];
  openSourceAlternative?: string;
}

interface Alternative {
  name: string;
  url: string;
  monthlyCost: number;           // 0 = free
  importSupport: boolean;
  dataCompatibility: number;     // 0-100%
  migrationGuideUrl?: string;
}

interface MigrationCosts {
  // Crowdsourced averages (minutes)
  avgExportTime: number;
  avgResearchTime: number;
  avgMigrationTime: number;
  avgLearningCurve: number;

  // Computed
  totalAvgMinutes: number;

  // Risk
  dataLossRisk: 'low' | 'medium' | 'high';
  estimatedDataLoss: number;     // 0-100%

  // Sample size
  reportCount: number;           // How many users reported
}

interface UserTaxReport {
  userId?: string;               // Anonymous by default
  products: UserProductImpact[];

  // Totals
  totalHours: number;
  totalOpportunityCost: number;  // hours × hourlyRate
  totalSubscriptionCost: number; // annual
  totalDataLossPercent: number;  // weighted average
  trustScoreImpact: number;      // -100 to 0

  // Fun stats
  timesGoogled: number;
  percentileRank: number;        // "Top 15%"
  worstOffender: string;         // "Google" probably
}

interface UserProductImpact {
  serviceId: string;
  serviceName: string;
  usageLevel: 'light' | 'moderate' | 'heavy' | 'power';

  // Personal costs (user-reported or estimated)
  hoursSpent: number;
  moneySwitched: number;
  dataLostPercent: number;
  emotionalDamage: number;       // 1-10 scale, tongue-in-cheek

  // What they switched to
  switchedTo?: string;
}
```

### Death Watch Schema

```typescript
interface ProductRisk {
  productName: string;
  company: string;
  currentStatus: 'active' | 'warning' | 'announced' | 'dead';

  // Risk assessment
  riskScore: number;             // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedDeathYear?: number;

  // Signals
  riskSignals: RiskSignal[];

  // User impact
  estimatedUsers: number;
  migrationDifficulty: number;   // 1-5

  lastAssessed: Date;
}

interface RiskSignal {
  type: 'low_adoption' | 'internal_competition' | 'leadership_change' |
        'reduced_updates' | 'sunset_language' | 'absorption_pattern' |
        'no_monetization' | 'negative_press' | 'api_deprecation';
  description: string;
  detectedDate: Date;
  sourceUrl?: string;
  severity: number;              // 1-10
}
```

---

## Platform Strategy

### Why Multi-Platform?

| Platform | Strength | Use Case |
|----------|----------|----------|
| **Web App** | Shareable, SEO, viral potential | Calculator, browsing, reports |
| **iOS App** | Widgets, notifications, native feel | Death Watch alerts, quick lookup |
| **MCP Server** | AI integration, developer tool | Claude queries, automation |
| **Browser Extension** | Contextual warnings | "This product may die" alerts |
| **Redash** | Analytics, internal use | Dashboards, trends |

### Platform Priority

**Phase 1: Web + MCP** (MVP)
- Web calculator = viral potential, shareable invoices
- MCP = developer adoption, AI integration

**Phase 2: iOS App**
- Widget showing "products at risk"
- Push notifications for death announcements
- Native calculator experience

**Phase 3: Browser Extension**
- Warning when visiting new Google product pages
- "This product is 2 years old with no monetization strategy"

---

## Web App Spec

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Hosting**: Vercel
- **Analytics**: Plausible (privacy-focused)

### Pages

```
/                           # Landing + Calculator preview
/calculator                 # Full Takeout Tax Calculator
/calculator/result/:id      # Shareable result page
/graveyard                  # Browse all dead products
/graveyard/:company         # Filter by company
/graveyard/:company/:slug   # Individual product page
/death-watch                # Products at risk
/playbooks                  # Migration guides
/playbooks/:slug            # Individual playbook
/api/graveyard              # Public JSON API
/api/calculate              # Calculator API
```

### Key Features

1. **Calculator Flow**
   - Select products you used (checkbox grid)
   - Optionally report your actual migration time
   - Enter hourly rate
   - Generate shareable invoice image

2. **Shareable Invoice**
   - OG image generation for social sharing
   - "I've paid $3,891 in Takeout Tax. Calculate yours."
   - Download as PDF

3. **Graveyard Browser**
   - Filter by company, category, year
   - Sort by lifespan, user impact, recency
   - Search

4. **Death Watch Dashboard**
   - Current risk assessments
   - Subscribe to alerts (email or push)

### Visual Design Direction

**Theme: Digital Cemetery meets Corporate Invoice**

- Dark mode default (graveyard aesthetic)
- Tombstone cards for dead products
- Receipt/invoice styling for tax reports
- Skull emoji sparingly (💀)
- Monospace fonts for "official document" feel
- Green terminal accents

---

## iOS App Spec

### Tech Stack
- **Framework**: SwiftUI
- **Data**: Share PostgreSQL via API
- **Notifications**: APNs
- **Widgets**: WidgetKit

### Screens

```
TabView:
├── Calculator Tab
│   ├── Product Selection
│   ├── Results View
│   └── Share Sheet
├── Graveyard Tab
│   ├── List View (filterable)
│   └── Detail View
├── Death Watch Tab
│   ├── Risk Dashboard
│   └── Alert Settings
└── Profile Tab
    ├── Your Tax History
    └── Settings
```

### Widgets

**Small Widget: Death Counter**
```
┌─────────────────┐
│ 💀 YOUR TAX     │
│                 │
│   $3,891        │
│   47.5 hours    │
│                 │
│ 8 products died │
└─────────────────┘
```

**Medium Widget: Death Watch**
```
┌─────────────────────────────────┐
│ ⚠️ DEATH WATCH                  │
│                                 │
│ 🔴 Google Keep      73% risk    │
│ 🟡 Google Fi        52% risk    │
│ 🟢 Gmail            3% risk     │
│                                 │
└─────────────────────────────────┘
```

### Notifications

- "⚠️ Google just announced [Product] is shutting down"
- "📋 Migration playbook available for [Product]"
- "🔴 [Product] risk increased to HIGH - consider alternatives"

---

## MCP Server Spec

### Tools

```typescript
tools:
  // Search & Browse
  - search_graveyard(query: string, filters?: Filters) → Service[]
  - get_service(slug: string) → Service
  - list_by_company(company: string) → Service[]
  - list_recent_deaths(days: number) → Service[]

  // Takeout Tax
  - calculate_tax(products: string[], hourlyRate?: number) → TaxReport
  - get_migration_costs(slug: string) → MigrationCosts

  // Death Watch
  - get_risk_assessment(product: string) → ProductRisk
  - list_at_risk_products(minRisk?: number) → ProductRisk[]

  // Preservation
  - get_preservation_links(slug: string) → PreservationData
  - get_migration_playbook(slug: string) → Playbook
  - find_alternatives(slug: string) → Alternative[]

  // Stats
  - get_company_stats(company: string) → CompanyStats
  - get_graveyard_stats() → GraveyardStats
```

### Example Queries

```
User: "How much time have people spent migrating from Google products?"

Claude: [calls get_company_stats("google")]

Response: "Google has killed 147 products. Based on crowdsourced data:
- Average migration time: 4.2 hours per product
- Total collective human hours lost: estimated 2.3 billion
- Products with highest migration cost: Google+, Play Music, Stadia"
```

```
User: "Should I use Google Keep or something else?"

Claude: [calls get_risk_assessment("google-keep")]

Response: "Google Keep has a 73% risk score based on:
- No monetization strategy
- Competing with Google Docs (notes feature)
- Feature absorption pattern (like Inbox → Gmail)

Consider alternatives: Notion, Obsidian, Apple Notes"
```

---

## Data Sources

### Phase 1 (Zero APIs - MVP)

1. **Manual Curation** (NO API)
   - killedbygoogle.com website (scraped once, imported)
   - GitHub codyogden/killedbygoogle repo (JSON file, cloned)
   - Wikipedia articles on defunct products
   - Company blog posts (archived versions from Wayback)

2. **Community Contributions** (NO API)
   - User submissions form on web app
   - Moderation before database entry
   - Crowdsourced migration costs

3. **Static Data Files** (NO API)
   - Pre-built dataset from research
   - Services.json with 150+ entries
   - Alternatives.json for migration options

### Phase 2+ (With APIs)

4. **Wayback Machine API**
   - Automated snapshot detection
   - Archive coverage percentage

5. **Scraper: killedby.tech**
   - Apple, Microsoft, Amazon products

6. **Real-time Monitoring** (Optional)
   - RSS feeds from company blogs
   - News aggregators

### Migration Cost Data
- **MVP**: Estimates based on product complexity
- **Phase 2+**: Crowdsourced reports via calculator
- **Validation**: Community votes, outlier detection

---

## Scope

### Data Coverage (All Tiers)
- **All tech companies** - Google, Microsoft, Amazon, Apple, Meta, smaller players
- **All service types** - Cloud services, communication tools, consumer apps, developer platforms

---

## MVP Phase 1 (Zero APIs - Launch ASAP)

### Why Zero APIs First?
- ✅ Deploy immediately (no OAuth, app verification, rate limits)
- ✅ User-controlled data (local Takeout parsing integrates)
- ✅ Parody/shareability features work without dependencies
- ✅ Build community before scaling to 1000+ services
- ✅ No external service downtime affects graveyard

### Deliverables
1. **PostgreSQL database** - Schema + migrations
2. **Manual data seeding** - 150+ curated services from public sources
3. **User submissions form** - Community contributions, verified
4. **Web app** - Calculator + browser + shareable invoices
5. **MCP server** - Core tools (search, filter, alternatives)
6. **Takeout Timeline MCP** - Query user's personal data during service lifetimes
7. **Redash dashboards** - Timeline, company breakdown, coverage stats

### Launch Data
- **150+ services** manually curated (correct > fast)
- **Sources**: killedbygoogle.com reference, public announcements, community research
- **Migration playbooks**: 10-15 for major services
- **Zero external APIs required**

### Tech Stack
- **Web**: Next.js + Tailwind + Vercel
- **DB**: PostgreSQL + Drizzle ORM
- **MCP**: Node.js + MCP SDK
- **Takeout Parser**: Node.js TypeScript
- **Dashboards**: Redash (self-hosted or managed)

### Timeline
- Week 1-2: Database schema + manual data curation
- Week 3: Web app (calculator + browser)
- Week 4: User submission form + moderation
- Week 5: Takeout Timeline MCP + integration
- Week 6: MCP server + Redash dashboards
- Week 7: Polish + launch

---

## Phase 2: iOS App

### Deliverables
1. **iOS app** - SwiftUI native
2. **Widgets** - Death counter, death watch
3. **Push notifications** - Death announcements, risk alerts
4. **Sync** - Same data as web via API

### Timeline
- 4 weeks after web launch

---

## Phase 3: Expansion

### Deliverables
1. **Browser extension** - "This product may die" warnings
2. **User accounts** - Save your tax history
3. **Community contributions** - Submit migration reports
4. **More companies** - Microsoft, Meta, Amazon, Apple
5. **Email digest** - Weekly death watch report

---

## Success Metrics

### Virality
- Calculator completions per month
- Shared invoices (social, direct)
- Press mentions / backlinks

### Engagement
- Return visitors
- MCP queries
- Newsletter subscribers

### Data Quality
- Services cataloged (target: 1000 by month 6)
- Migration reports submitted
- Playbooks created

### Community
- GitHub stars
- Contributors
- User-submitted products

---

## Repository Structure

```
graveyard/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing
│   │   │   ├── calculator/
│   │   │   ├── graveyard/
│   │   │   ├── death-watch/
│   │   │   ├── playbooks/
│   │   │   └── api/
│   │   ├── components/
│   │   └── lib/
│   ├── ios/                    # SwiftUI iOS app
│   │   ├── Graveyard/
│   │   ├── Widgets/
│   │   └── Graveyard.xcodeproj
│   └── mcp/                    # MCP server
│       └── server.ts
├── packages/
│   ├── db/                     # Shared database
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── seed/
│   ├── scrapers/               # Data collection
│   │   ├── killedbygoogle.ts
│   │   ├── wayback.ts
│   │   └── announcements.ts
│   └── shared/                 # Shared types
│       └── types.ts
├── docs/
│   ├── SPEC.md                 # This file
│   ├── API.md
│   └── CONTRIBUTING.md
├── scripts/
│   ├── seed.ts
│   └── scrape.ts
├── docker-compose.yml
├── package.json
├── turbo.json                  # Monorepo config
└── .env.example
```

---

## Parody & Marketing Angles

### Taglines
- "Don't get attached."
- "Calculating your Takeout Tax since 2024"
- "Part obituary, part invoice"
- "Google Hospice: We'll tell you when it's time"
- "The only Google product that tracks Google products dying"

### Social Content Ideas
- Weekly "In Memoriam" posts
- "On this day in history, Google killed..."
- Fake "Google Takeout Premium" - "Export faster before it's gone"
- "Google Product Roulette" - Spin to see what dies next
- Fake support tickets: "Hi, my favorite product was killed..."

### Potential Features (Fun)
- **Obituary Generator** - Write eulogies for dead products
- **Graveyard Tour** - Interactive timeline walkthrough
- **Memorial Wall** - Users leave "RIP" messages
- **Death Pool** - Predict which products die next (gamified)
- **Survivor's Guilt Quiz** - "Which dead products did you abandon?"

---

## Open Questions

1. **Monetization?**
   - Probably not - keep it a public service
   - Maybe: Premium Death Watch alerts, enterprise API

2. **User accounts?**
   - MVP: Anonymous, shareable via URL
   - Phase 2: Optional accounts to save history

3. **Legal concerns?**
   - Fair use for commentary/criticism
   - Using company logos? Probably fine for editorial
   - "Not affiliated with Google" disclaimer

4. **Community moderation?**
   - User submissions need review
   - Migration cost outliers flagged

---

## Next Steps

1. [ ] Set up monorepo (Turborepo)
2. [ ] Initialize PostgreSQL + Drizzle schema
3. [ ] Build killedbygoogle scraper
4. [ ] Seed initial dataset (150 Google services)
5. [ ] Build calculator UI
6. [ ] Build graveyard browser
7. [ ] Generate shareable OG images
8. [ ] Deploy to Vercel
9. [ ] Build MCP server
10. [ ] Write 10 migration playbooks
11. [ ] Launch & promote

---

## References

- [Killed by Google](https://killedbygoogle.com)
- [GitHub: killedbygoogle](https://github.com/codyogden/killedbygoogle)
- [killedby.tech](https://www.killedby.tech/)
- [Microsoft Graveyard](https://github.com/victorfrye/microsoftgraveyard)
- [Google Takeout](https://takeout.google.com)
