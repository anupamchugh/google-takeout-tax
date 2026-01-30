# 💀 Takeout Tax

> Calculate how much Google has cost you by killing products you used.

[![npm](https://img.shields.io/npm/v/takeout-tax)](https://www.npmjs.com/package/takeout-tax)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Google has killed 290+ products since 2006. Every time they do, you pay a hidden **Takeout Tax**:

- ⏱️ Hours spent exporting your data
- 🔍 Hours researching alternatives
- 🚚 Hours migrating to new services
- 📚 Hours learning new tools
- 💸 Subscription costs for paid replacements
- 📉 Data that couldn't be exported

**This CLI scans your Google Takeout folder and calculates your personal Takeout Tax.**

## Quick Start

```bash
npx takeout-tax ~/Downloads/Takeout
```

## Example Output

```
╔════════════════════════════════════════════════════════════════╗
║                    💀 TAKEOUT TAX INVOICE 💀                   ║
╠════════════════════════════════════════════════════════════════╣
║  Account:          Since December 2013                         ║
║  Products Scanned: 15                                          ║
║  Hourly Rate:      $50                                         ║
╠════════════════════════════════════════════════════════════════╣
║  DEAD PRODUCTS FOUND:                                          ║
║                                                                ║
║  ❌ Google Play Music           Died: 2020-12-04              ║
║     4,521 files, 12.3 GB                                       ║
║     Migration: 6h | Risk: MEDIUM                               ║
║                                                                ║
║  ❌ Google Hangouts              Died: 2022-11-01              ║
║     892 files, 156.2 MB                                        ║
║     Migration: 3h | Risk: MEDIUM                               ║
║                                                                ║
║  ❌ Google+                      Died: 2019-04-02              ║
║     2,104 files, 3.1 GB                                        ║
║     Migration: 4h | Risk: HIGH                                 ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  YOUR TAKEOUT TAX:                                             ║
║                                                                ║
║  ⏱️  Migration Hours:     13                                   ║
║  💰 Opportunity Cost:    $650                                  ║
║  📉 Products Lost:       3                                     ║
║  ⚠️  High Risk Data:      33%                                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

You've been "Googled" 3 times.
```

## Installation

### Run directly (no install)

```bash
npx takeout-tax ~/Downloads/Takeout
```

### Install globally

```bash
npm install -g takeout-tax
takeout-tax ~/Downloads/Takeout
```

## How to Get Your Google Takeout Data

1. Go to [takeout.google.com](https://takeout.google.com)
2. Click **"Deselect all"** then **"Select all"** (to get everything)
3. Click **"Next step"** → **"Create export"**
4. Wait for email, download the ZIP
5. Extract the ZIP
6. Run: `npx takeout-tax ~/Downloads/Takeout`

## Options

```bash
# Set your hourly rate (default: $50)
npx takeout-tax ~/Downloads/Takeout --rate 75

# Output as JSON (for programmatic use)
npx takeout-tax ~/Downloads/Takeout --json

# Get help
npx takeout-tax --help
```

## What Products Are Tracked?

We track 20+ major Google products that were killed:

| Product | Died | Migration Cost |
|---------|------|----------------|
| Google Reader | 2013 | 3 hours |
| Google+ | 2019 | 4 hours |
| Inbox by Gmail | 2019 | 2 hours |
| Google Play Music | 2020 | 6 hours |
| Google Hangouts | 2022 | 3 hours |
| Google Podcasts | 2024 | 1 hour |
| Google Stadia | 2023 | 0 hours (refunded) |
| Notes on Search | 2024 | 0.5 hours |
| ... and more | | |

Full list: [killedbygoogle.com](https://killedbygoogle.com)

## Privacy

✅ **100% local processing** - your data never leaves your machine

The tool only reads folder names and file metadata (count, size, dates). It does NOT read the contents of your files.

## JSON Output

```bash
npx takeout-tax ~/Downloads/Takeout --json
```

```json
{
  "accountAge": "Since December 2013",
  "productsScanned": 15,
  "hourlyRate": 50,
  "deadProducts": [
    {
      "name": "Google Play Music",
      "diedOn": "2020-12-04",
      "files": 4521,
      "size": 13204889600,
      "migrationHours": 6,
      "dataLossRisk": "medium",
      "alternatives": ["YouTube Music", "Spotify"]
    }
  ],
  "aliveProducts": ["Gmail", "Drive", "Photos"],
  "tax": {
    "migrationHours": 13,
    "opportunityCost": 650,
    "productsLost": 3,
    "dataAtRiskPercent": 33
  }
}
```

## Coming Soon

- 🌐 **Web app** - Drag & drop Takeout folder, get shareable invoice image
- 📱 **iOS app** - Widgets showing your tax + death watch alerts
- 🤖 **MCP server** - Claude integration for AI-powered analysis

## Contributing

PRs welcome! Add more killed products, improve migration estimates, or suggest features.

```bash
git clone https://github.com/anupamchugh/takeout-tax
cd takeout-tax
npm install
npm run dev ~/Downloads/Takeout
```

## Related

- [killedbygoogle.com](https://killedbygoogle.com) - The Google Graveyard
- [Google Takeout](https://takeout.google.com) - Export your data

## License

MIT

---

**Don't get attached.** 💀
