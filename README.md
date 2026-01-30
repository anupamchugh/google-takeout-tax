# 💀 Graveyard: Takeout Tax + Where I Was

> Part obituary, part invoice. Don't get attached.

A collection of tools to track, mourn, and calculate the cost of Google killing products.

## The Irony That Writes Itself

```
2023-11 → Google launches "Notes on Search"
          (leave notes on search results)

2024-07 → Google kills Notes on Search
          (users told to export via Google Takeout)

2025-01 → We build a tool to scan Takeout for dead products
          ...which finds your notes about dead products

          Meta.
```

---

## 📦 Takeout Tax CLI

**Calculate your personal Google migration costs.**

```bash
npx takeout-tax ~/Downloads/Takeout
```

```
╔════════════════════════════════════════════════════════════════╗
║                    💀 TAKEOUT TAX INVOICE 💀                   ║
╠════════════════════════════════════════════════════════════════╣
║  Account:          Since December 2013                         ║
║  Products Scanned: 15                                          ║
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

### Quick Start

```bash
# Run directly (no install)
npx takeout-tax ~/Downloads/Takeout

# Set your hourly rate
npx takeout-tax ~/Downloads/Takeout --rate 75

# JSON output
npx takeout-tax ~/Downloads/Takeout --json
```

### Get Your Takeout Data

1. Go to [takeout.google.com](https://takeout.google.com)
2. Select **Maps** + **Timeline** (we don't need Location History!)
3. Create export → Download ZIP → Extract
4. Run the CLI on the extracted folder

> **Note:** Most people don't have Location History enabled (it's opt-in and creepy). We extract location data from your **Maps labelled places** and **commute routes** instead. See [WHERE_I_WAS_SPEC.md](./WHERE_I_WAS_SPEC.md) for details.

[Full CLI docs →](./apps/takeout-tax/README.md)

---

## 🪦 Where I Was (Coming Soon)

**When Google Inbox died, where were you?**

```
🪦 WHERE I WAS: Service Death Timeline

[1] 3/22/2019 - Google Inbox
    📍 You were in Tokyo, Japan when Google Inbox died.

[2] 7/1/2013 - Google Reader
    📍 You were in San Francisco, CA when Google Reader died.

[3] 12/4/2020 - Google Play Music
    📍 You were in London, UK when Google Play Music died.
```

Correlates your location history with the death of tech services.

---

## 🌐 Web App (Planned)

- Drag & drop Takeout folder (client-side only)
- Generate shareable invoice image
- OG image for social: "I've paid $X in Takeout Tax"

## 🤖 MCP Server (Planned)

- Claude integration
- "Scan my Takeout and show what I lost"
- "Should I use Google Keep?" → Death Watch risk assessment

## 📱 iOS App (Planned)

- Widget: Your Takeout Tax total
- Widget: Products at risk (Death Watch)
- Push notifications when Google kills something

---

## Project Structure

```
graveyard/
├── apps/
│   ├── takeout-tax/          # CLI (npx takeout-tax) ← HN LAUNCH
│   └── cli/                  # Where I Was demo
├── packages/
│   ├── graveyard-data/       # Killed products database
│   ├── takeout-parser/       # Takeout folder scanner
│   ├── correlation/          # Location ↔ death matching
│   └── types/                # Shared types
├── SPEC.md                   # Full project specification
└── README.md                 # You are here
```

---

## Data Sources

- [killedbygoogle.com](https://killedbygoogle.com) - 290+ dead Google products
- [killedby.tech](https://www.killedby.tech) - Apple, Microsoft, Amazon
- Manual curation + crowdsourced migration cost estimates

---

## Privacy

✅ **100% local processing** - your data never leaves your machine

The tools only read folder names and file metadata (count, size, dates). They do NOT read the contents of your files.

---

## Development

```bash
# Clone
git clone https://github.com/anupamchugh/google-takeout-tax
cd graveyard

# Install
npm install

# Run Takeout Tax CLI
npm run cli:tax ~/Downloads/Takeout

# Run Where I Was demo
npm run cli
```

---

## Contributing

1. Add more killed products to `packages/graveyard-data`
2. Improve migration cost estimates
3. Report bugs or suggest features

PRs welcome!

---

## Specs

- [SPEC.md](./SPEC.md) - Full project specification
- [takeout-mcp-spec.md](./takeout-mcp-spec.md) - MCP server design

---

## License

MIT

---

**Remember:** Your favorite Google product is already on death row. Export early, export often. 💀
