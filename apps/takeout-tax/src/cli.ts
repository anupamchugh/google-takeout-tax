#!/usr/bin/env node

/**
 * Takeout Tax CLI
 *
 * Calculate how much Google has cost you by killing products you used.
 *
 * Usage:
 *   npx takeout-tax ~/Downloads/Takeout
 *   npx takeout-tax ~/Downloads/Takeout --rate 75
 *   npx takeout-tax ~/Downloads/Takeout --json
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// GRAVEYARD DATA (embedded for zero dependencies)
// ═══════════════════════════════════════════════════════════════════════════

interface KilledProduct {
  name: string;
  slug: string;
  dateOpen: string;
  dateClose: string;
  description: string;
  takeoutFolder?: string;
  avgMigrationHours: number;
  dataLossRisk: 'low' | 'medium' | 'high';
  alternatives: string[];
}

const GRAVEYARD: KilledProduct[] = [
  {
    name: 'Google Reader',
    slug: 'google-reader',
    dateOpen: '2005-10-07',
    dateClose: '2013-07-01',
    description: 'RSS feed aggregator',
    takeoutFolder: 'Reader',
    avgMigrationHours: 3,
    dataLossRisk: 'low',
    alternatives: ['Feedly', 'Inoreader'],
  },
  {
    name: 'Google+',
    slug: 'google-plus',
    dateOpen: '2011-06-28',
    dateClose: '2019-04-02',
    description: 'Social network',
    takeoutFolder: 'Google+ Stream',
    avgMigrationHours: 4,
    dataLossRisk: 'high',
    alternatives: ['Nothing'],
  },
  {
    name: 'Inbox by Gmail',
    slug: 'inbox-by-gmail',
    dateOpen: '2014-10-22',
    dateClose: '2019-04-02',
    description: 'Smart email',
    takeoutFolder: 'Inbox',
    avgMigrationHours: 2,
    dataLossRisk: 'low',
    alternatives: ['Gmail'],
  },
  {
    name: 'Google Play Music',
    slug: 'google-play-music',
    dateOpen: '2011-05-10',
    dateClose: '2020-12-04',
    description: 'Music streaming + uploads',
    takeoutFolder: 'Google Play Music',
    avgMigrationHours: 6,
    dataLossRisk: 'medium',
    alternatives: ['YouTube Music', 'Spotify'],
  },
  {
    name: 'Google Hangouts',
    slug: 'hangouts',
    dateOpen: '2013-05-15',
    dateClose: '2022-11-01',
    description: 'Messaging & video',
    takeoutFolder: 'Hangouts',
    avgMigrationHours: 3,
    dataLossRisk: 'medium',
    alternatives: ['Google Chat', 'WhatsApp'],
  },
  {
    name: 'Google Podcasts',
    slug: 'google-podcasts',
    dateOpen: '2018-06-18',
    dateClose: '2024-06-23',
    description: 'Podcast app',
    takeoutFolder: 'Google Podcasts',
    avgMigrationHours: 1,
    dataLossRisk: 'low',
    alternatives: ['YouTube Music', 'Pocket Casts'],
  },
  {
    name: 'Google Stadia',
    slug: 'stadia',
    dateOpen: '2019-11-19',
    dateClose: '2023-01-18',
    description: 'Cloud gaming',
    takeoutFolder: 'Stadia',
    avgMigrationHours: 0,
    dataLossRisk: 'high',
    alternatives: ['Xbox Cloud', 'GeForce NOW'],
  },
  {
    name: 'Google Notes on Search',
    slug: 'notes-on-search',
    dateOpen: '2023-11-01',
    dateClose: '2024-07-31',
    description: 'Search annotations',
    takeoutFolder: 'Notes',
    avgMigrationHours: 0.5,
    dataLossRisk: 'high',
    alternatives: ['Nothing'],
  },
  {
    name: 'Google Allo',
    slug: 'google-allo',
    dateOpen: '2016-09-21',
    dateClose: '2019-03-13',
    description: 'Messaging with AI',
    takeoutFolder: 'Google Allo',
    avgMigrationHours: 2,
    dataLossRisk: 'high',
    alternatives: ['Messages', 'WhatsApp'],
  },
  {
    name: 'Google Wave',
    slug: 'google-wave',
    dateOpen: '2009-05-27',
    dateClose: '2012-04-30',
    description: 'Real-time collab',
    takeoutFolder: 'Wave',
    avgMigrationHours: 2,
    dataLossRisk: 'high',
    alternatives: ['Google Docs', 'Notion'],
  },
  {
    name: 'Google Bookmarks',
    slug: 'google-bookmarks',
    dateOpen: '2005-10-10',
    dateClose: '2021-09-30',
    description: 'Bookmark sync',
    takeoutFolder: 'Bookmarks',
    avgMigrationHours: 1,
    dataLossRisk: 'low',
    alternatives: ['Chrome bookmarks'],
  },
  {
    name: 'Picasa',
    slug: 'picasa',
    dateOpen: '2004-07-15',
    dateClose: '2016-05-01',
    description: 'Photo organizing',
    takeoutFolder: 'Picasa',
    avgMigrationHours: 3,
    dataLossRisk: 'low',
    alternatives: ['Google Photos'],
  },
  {
    name: 'Google Trips',
    slug: 'google-trips',
    dateOpen: '2016-09-19',
    dateClose: '2019-08-05',
    description: 'Travel planning',
    takeoutFolder: 'Trips',
    avgMigrationHours: 1,
    dataLossRisk: 'medium',
    alternatives: ['Google Maps', 'TripIt'],
  },
];

const ALIVE_PRODUCTS = [
  'Gmail', 'Mail', 'Drive', 'Photos', 'YouTube', 'Maps', 'Chrome',
  'Calendar', 'Contacts', 'Keep', 'Tasks', 'Fit', 'Home',
  'Timeline', 'Voice', 'Blogger', 'Groups', 'Meet', 'Chat',
];

// ═══════════════════════════════════════════════════════════════════════════
// SCANNER
// ═══════════════════════════════════════════════════════════════════════════

interface ScanResult {
  folder: string;
  status: 'dead' | 'alive' | 'unknown';
  product?: KilledProduct;
  fileCount: number;
  sizeBytes: number;
  oldestFile?: Date;
  newestFile?: Date;
}

interface TaxReport {
  accountAge: string;
  oldestData?: Date;
  totalFolders: number;
  deadProducts: ScanResult[];
  aliveProducts: ScanResult[];
  unknownProducts: ScanResult[];
  totalMigrationHours: number;
  opportunityCost: number;
  productsLost: number;
  dataAtRiskPercent: number;
  hourlyRate: number;
}

function scanFolder(takeoutPath: string): ScanResult[] {
  const results: ScanResult[] = [];

  if (!fs.existsSync(takeoutPath)) {
    console.error(`\n❌ Folder not found: ${takeoutPath}\n`);
    process.exit(1);
  }

  const items = fs.readdirSync(takeoutPath, { withFileTypes: true });

  for (const item of items) {
    if (!item.isDirectory() || item.name.startsWith('.')) continue;

    const folderPath = path.join(takeoutPath, item.name);
    const stats = getFolderStats(folderPath);

    // Check against graveyard
    const deadProduct = GRAVEYARD.find(p =>
      p.takeoutFolder?.toLowerCase() === item.name.toLowerCase() ||
      p.name.toLowerCase() === item.name.toLowerCase()
    );

    const isAlive = ALIVE_PRODUCTS.some(p =>
      item.name.toLowerCase().includes(p.toLowerCase())
    );

    let status: 'dead' | 'alive' | 'unknown';
    if (deadProduct) {
      status = 'dead';
    } else if (isAlive) {
      status = 'alive';
    } else {
      status = 'unknown';
    }

    results.push({
      folder: item.name,
      status,
      product: deadProduct,
      ...stats,
    });
  }

  return results;
}

function getFolderStats(folderPath: string): {
  fileCount: number;
  sizeBytes: number;
  oldestFile?: Date;
  newestFile?: Date;
} {
  let fileCount = 0;
  let sizeBytes = 0;
  let oldestFile: Date | undefined;
  let newestFile: Date | undefined;

  function walk(dir: string) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          walk(fullPath);
        } else {
          fileCount++;
          try {
            const stat = fs.statSync(fullPath);
            sizeBytes += stat.size;
            if (!oldestFile || stat.mtime < oldestFile) oldestFile = stat.mtime;
            if (!newestFile || stat.mtime > newestFile) newestFile = stat.mtime;
          } catch {}
        }
      }
    } catch {}
  }

  walk(folderPath);
  return { fileCount, sizeBytes, oldestFile, newestFile };
}

function calculateTax(results: ScanResult[], hourlyRate: number): TaxReport {
  const dead = results.filter(r => r.status === 'dead');
  const alive = results.filter(r => r.status === 'alive');
  const unknown = results.filter(r => r.status === 'unknown');

  const totalHours = dead.reduce((sum, r) => sum + (r.product?.avgMigrationHours || 2), 0);
  const highRisk = dead.filter(r => r.product?.dataLossRisk === 'high').length;
  const riskPercent = dead.length > 0 ? Math.round((highRisk / dead.length) * 100) : 0;

  // Find oldest data across all folders
  let oldestData: Date | undefined;
  for (const r of results) {
    if (r.oldestFile && (!oldestData || r.oldestFile < oldestData)) {
      oldestData = r.oldestFile;
    }
  }

  const accountAge = oldestData
    ? `Since ${oldestData.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : 'Unknown';

  return {
    accountAge,
    oldestData,
    totalFolders: results.length,
    deadProducts: dead,
    aliveProducts: alive,
    unknownProducts: unknown,
    totalMigrationHours: totalHours,
    opportunityCost: totalHours * hourlyRate,
    productsLost: dead.length,
    dataAtRiskPercent: riskPercent,
    hourlyRate,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// OUTPUT FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function printReport(report: TaxReport): void {
  const width = 64;
  const line = '═'.repeat(width);
  const thinLine = '─'.repeat(width);

  console.log('');
  console.log(`╔${line}╗`);
  console.log(`║${'💀 TAKEOUT TAX INVOICE 💀'.padStart(42).padEnd(width)}║`);
  console.log(`╠${line}╣`);
  console.log(`║  Account:          ${report.accountAge.padEnd(width - 21)}║`);
  console.log(`║  Products Scanned: ${String(report.totalFolders).padEnd(width - 21)}║`);
  console.log(`║  Hourly Rate:      $${String(report.hourlyRate).padEnd(width - 22)}║`);
  console.log(`╠${line}╣`);

  if (report.deadProducts.length === 0) {
    console.log(`║${''.padEnd(width)}║`);
    console.log(`║${'  No dead products found in this export.'.padEnd(width)}║`);
    console.log(`║${'  Try exporting ALL data from takeout.google.com'.padEnd(width)}║`);
    console.log(`║${''.padEnd(width)}║`);
  } else {
    console.log(`║${'  DEAD PRODUCTS FOUND:'.padEnd(width)}║`);
    console.log(`║${''.padEnd(width)}║`);

    for (const dead of report.deadProducts) {
      const name = dead.product?.name || dead.folder;
      const date = dead.product?.dateClose || '?';
      const hours = dead.product?.avgMigrationHours || 0;
      const risk = dead.product?.dataLossRisk || '?';

      console.log(`║  ❌ ${name.padEnd(25)} Died: ${date.padEnd(12)}║`);
      console.log(`║     ${`${dead.fileCount} files, ${formatSize(dead.sizeBytes)}`.padEnd(width - 6)}║`);
      console.log(`║     Migration: ${hours}h | Risk: ${risk.toUpperCase().padEnd(width - 28)}║`);
      console.log(`║${''.padEnd(width)}║`);
    }
  }

  console.log(`╠${line}╣`);
  console.log(`║${'  YOUR TAKEOUT TAX:'.padEnd(width)}║`);
  console.log(`║${''.padEnd(width)}║`);
  console.log(`║  ⏱️  Migration Hours:     ${String(report.totalMigrationHours).padEnd(width - 28)}║`);
  console.log(`║  💰 Opportunity Cost:    $${String(report.opportunityCost.toLocaleString()).padEnd(width - 29)}║`);
  console.log(`║  📉 Products Lost:       ${String(report.productsLost).padEnd(width - 28)}║`);
  console.log(`║  ⚠️  High Risk Data:      ${(report.dataAtRiskPercent + '%').padEnd(width - 28)}║`);
  console.log(`║${''.padEnd(width)}║`);
  console.log(`╚${line}╝`);

  // Fun stats
  if (report.productsLost > 0) {
    console.log('');
    console.log(`You've been "Googled" ${report.productsLost} time${report.productsLost > 1 ? 's' : ''}.`);
    console.log('');
  }

  // Alive products summary
  if (report.aliveProducts.length > 0) {
    console.log(`Still alive: ${report.aliveProducts.map(a => a.folder).join(', ')}`);
    console.log('');
  }

  // Call to action
  console.log(`Share your results: https://anupamchugh.github.io/google-takeout-tax`);
  console.log(`Source: https://github.com/anupamchugh/google-takeout-tax`);
  console.log('');
}

function printJson(report: TaxReport): void {
  const output = {
    accountAge: report.accountAge,
    productsScanned: report.totalFolders,
    hourlyRate: report.hourlyRate,
    deadProducts: report.deadProducts.map(d => ({
      name: d.product?.name || d.folder,
      diedOn: d.product?.dateClose,
      files: d.fileCount,
      size: d.sizeBytes,
      migrationHours: d.product?.avgMigrationHours,
      dataLossRisk: d.product?.dataLossRisk,
      alternatives: d.product?.alternatives,
    })),
    aliveProducts: report.aliveProducts.map(a => a.folder),
    tax: {
      migrationHours: report.totalMigrationHours,
      opportunityCost: report.opportunityCost,
      productsLost: report.productsLost,
      dataAtRiskPercent: report.dataAtRiskPercent,
    },
  };
  console.log(JSON.stringify(output, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

function printHelp(): void {
  console.log(`
💀 Takeout Tax - Calculate your Google migration costs

Usage:
  npx takeout-tax <path-to-takeout-folder> [options]

Options:
  --rate <number>   Your hourly rate in USD (default: 50)
  --json            Output as JSON
  --help            Show this help

Examples:
  npx takeout-tax ~/Downloads/Takeout
  npx takeout-tax ~/Downloads/Takeout --rate 75
  npx takeout-tax ~/Downloads/Takeout --json > report.json

How to get your Takeout data:
  1. Go to https://takeout.google.com
  2. Click "Deselect all" then "Select all"
  3. Click "Next step" → "Create export"
  4. Download and extract the ZIP
  5. Run this tool on the extracted folder

Learn more: https://github.com/anupamchugh/google-takeout-tax
`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  let takeoutPath = args[0];
  let hourlyRate = 50;
  let jsonOutput = false;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--rate' && args[i + 1]) {
      hourlyRate = parseInt(args[i + 1]) || 50;
      i++;
    }
    if (args[i] === '--json') {
      jsonOutput = true;
    }
  }

  // Expand ~ to home directory
  if (takeoutPath.startsWith('~')) {
    takeoutPath = takeoutPath.replace('~', process.env.HOME || '');
  }

  // Scan and report
  const results = scanFolder(takeoutPath);
  const report = calculateTax(results, hourlyRate);

  if (jsonOutput) {
    printJson(report);
  } else {
    printReport(report);
  }
}

main();
