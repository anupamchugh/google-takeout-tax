/**
 * Takeout Tax Scanner - Proof of Concept
 *
 * Scans a Google Takeout folder and cross-references with killed products
 * to calculate your personal "Takeout Tax"
 */

import * as fs from 'fs';
import * as path from 'path';

// Killed products that would have Takeout folders
// Mapping: Takeout folder name → killed product info
const KILLED_PRODUCTS: Record<string, {
  name: string;
  dateClose: string;
  description: string;
  avgMigrationHours: number;
  dataLossRisk: 'low' | 'medium' | 'high';
}> = {
  // Exact folder name matches
  'Google+ Stream': {
    name: 'Google+',
    dateClose: '2019-04-02',
    description: 'Social network with circles, posts, photos',
    avgMigrationHours: 4,
    dataLossRisk: 'high'
  },
  'Google Play Music': {
    name: 'Google Play Music',
    dateClose: '2020-10-22',
    description: 'Music streaming and uploads',
    avgMigrationHours: 6,
    dataLossRisk: 'medium'
  },
  'Hangouts': {
    name: 'Google Hangouts',
    dateClose: '2022-11-01',
    description: 'Messaging and video calls',
    avgMigrationHours: 3,
    dataLossRisk: 'medium'
  },
  'Google Podcasts': {
    name: 'Google Podcasts',
    dateClose: '2024-06-23',
    description: 'Podcast subscriptions and progress',
    avgMigrationHours: 1,
    dataLossRisk: 'low'
  },
  'Inbox': {
    name: 'Inbox by Gmail',
    dateClose: '2019-04-02',
    description: 'Smart email with bundles and snooze',
    avgMigrationHours: 2,
    dataLossRisk: 'low'
  },
  'Google Reader': {
    name: 'Google Reader',
    dateClose: '2013-07-01',
    description: 'RSS feed reader',
    avgMigrationHours: 3,
    dataLossRisk: 'low'
  },
  'Stadia': {
    name: 'Google Stadia',
    dateClose: '2023-01-18',
    description: 'Cloud gaming platform',
    avgMigrationHours: 0, // Refunds issued
    dataLossRisk: 'high' // Game saves lost
  },
  'Google Bookmarks': {
    name: 'Google Bookmarks',
    dateClose: '2021-09-30',
    description: 'Web bookmarks service',
    avgMigrationHours: 1,
    dataLossRisk: 'low'
  },
  'Google Allo': {
    name: 'Google Allo',
    dateClose: '2019-03-13',
    description: 'Messaging app with Google Assistant',
    avgMigrationHours: 2,
    dataLossRisk: 'high'
  },
  'YouTube Gaming': {
    name: 'YouTube Gaming',
    dateClose: '2019-05-30',
    description: 'Gaming-focused video platform',
    avgMigrationHours: 1,
    dataLossRisk: 'low'
  },
  'Notes': {
    name: 'Google Notes on Search',
    dateClose: '2024-07-31',
    description: 'Add notes/annotations to search results - Labs experiment',
    avgMigrationHours: 0.5,
    dataLossRisk: 'high' // No real export, data just gone
  },
  // Still alive but might die (for Death Watch)
  'Google Keep': {
    name: 'Google Keep',
    dateClose: '', // Still alive
    description: 'Notes app - STILL ALIVE but at risk',
    avgMigrationHours: 0,
    dataLossRisk: 'low'
  }
};

// Products still alive (for context)
const ALIVE_PRODUCTS = [
  'Maps', 'Gmail', 'Drive', 'Photos', 'YouTube', 'Chrome',
  'Calendar', 'Contacts', 'Keep', 'Tasks', 'Fit', 'Home',
  'Timeline', 'Voice', 'Blogger', 'Groups'
];

interface ScanResult {
  folder: string;
  path: string;
  status: 'dead' | 'alive' | 'unknown';
  product?: typeof KILLED_PRODUCTS[string];
  fileCount: number;
  oldestFile?: Date;
  newestFile?: Date;
  sizeBytes: number;
}

interface TakeoutTaxReport {
  accountAge: string;
  totalFolders: number;
  deadProducts: ScanResult[];
  aliveProducts: ScanResult[];
  unknownProducts: ScanResult[];

  // Tax calculation
  totalMigrationHours: number;
  opportunityCost: number; // at $50/hr
  productsLost: number;
  dataAtRisk: number; // percentage
}

function scanTakeoutFolder(takeoutPath: string): ScanResult[] {
  const results: ScanResult[] = [];

  if (!fs.existsSync(takeoutPath)) {
    console.error(`Takeout folder not found: ${takeoutPath}`);
    return results;
  }

  const items = fs.readdirSync(takeoutPath, { withFileTypes: true });

  for (const item of items) {
    if (!item.isDirectory()) continue;
    if (item.name.startsWith('.')) continue; // Skip hidden

    const folderPath = path.join(takeoutPath, item.name);
    const stats = getFolderStats(folderPath);

    // Check if it's a killed product
    const killedProduct = KILLED_PRODUCTS[item.name];
    const isAlive = ALIVE_PRODUCTS.some(p =>
      item.name.toLowerCase().includes(p.toLowerCase())
    );

    let status: 'dead' | 'alive' | 'unknown';
    if (killedProduct && killedProduct.dateClose) {
      status = 'dead';
    } else if (isAlive) {
      status = 'alive';
    } else {
      status = 'unknown';
    }

    results.push({
      folder: item.name,
      path: folderPath,
      status,
      product: killedProduct,
      ...stats
    });
  }

  return results;
}

function getFolderStats(folderPath: string): {
  fileCount: number;
  oldestFile?: Date;
  newestFile?: Date;
  sizeBytes: number;
} {
  let fileCount = 0;
  let oldestFile: Date | undefined;
  let newestFile: Date | undefined;
  let sizeBytes = 0;

  function walkDir(dir: string) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          walkDir(fullPath);
        } else {
          fileCount++;
          try {
            const stat = fs.statSync(fullPath);
            sizeBytes += stat.size;

            if (!oldestFile || stat.mtime < oldestFile) {
              oldestFile = stat.mtime;
            }
            if (!newestFile || stat.mtime > newestFile) {
              newestFile = stat.mtime;
            }
          } catch {}
        }
      }
    } catch {}
  }

  walkDir(folderPath);
  return { fileCount, oldestFile, newestFile, sizeBytes };
}

function calculateTax(results: ScanResult[], hourlyRate: number = 50): TakeoutTaxReport {
  const deadProducts = results.filter(r => r.status === 'dead');
  const aliveProducts = results.filter(r => r.status === 'alive');
  const unknownProducts = results.filter(r => r.status === 'unknown');

  // Calculate migration hours
  const totalMigrationHours = deadProducts.reduce((sum, r) => {
    return sum + (r.product?.avgMigrationHours || 2);
  }, 0);

  // Calculate data at risk (weighted by high risk products)
  const highRiskCount = deadProducts.filter(r =>
    r.product?.dataLossRisk === 'high'
  ).length;
  const dataAtRisk = deadProducts.length > 0
    ? Math.round((highRiskCount / deadProducts.length) * 100)
    : 0;

  // Find oldest file to estimate account age
  let oldestDate: Date | undefined;
  for (const r of results) {
    if (r.oldestFile && (!oldestDate || r.oldestFile < oldestDate)) {
      oldestDate = r.oldestFile;
    }
  }

  const accountAge = oldestDate
    ? `Since ${oldestDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : 'Unknown';

  return {
    accountAge,
    totalFolders: results.length,
    deadProducts,
    aliveProducts,
    unknownProducts,
    totalMigrationHours,
    opportunityCost: totalMigrationHours * hourlyRate,
    productsLost: deadProducts.length,
    dataAtRisk
  };
}

function formatReport(report: TakeoutTaxReport): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('╔══════════════════════════════════════════════════════════════╗');
  lines.push('║            💀 TAKEOUT TAX REPORT 💀                          ║');
  lines.push('╠══════════════════════════════════════════════════════════════╣');
  lines.push(`║  Account Age:        ${report.accountAge.padEnd(38)}║`);
  lines.push(`║  Products Scanned:   ${String(report.totalFolders).padEnd(38)}║`);
  lines.push('╠══════════════════════════════════════════════════════════════╣');
  lines.push('║  DEAD PRODUCTS FOUND:                                        ║');

  if (report.deadProducts.length === 0) {
    lines.push('║    (none in this export - try exporting ALL data)            ║');
  } else {
    for (const dead of report.deadProducts) {
      const name = dead.product?.name || dead.folder;
      const date = dead.product?.dateClose || '?';
      lines.push(`║    ❌ ${name.padEnd(25)} Died: ${date.padEnd(18)}║`);
    }
  }

  lines.push('╠══════════════════════════════════════════════════════════════╣');
  lines.push('║  ALIVE PRODUCTS:                                             ║');

  for (const alive of report.aliveProducts.slice(0, 5)) {
    lines.push(`║    ✅ ${alive.folder.padEnd(52)}║`);
  }
  if (report.aliveProducts.length > 5) {
    lines.push(`║    ... and ${report.aliveProducts.length - 5} more                                          ║`);
  }

  lines.push('╠══════════════════════════════════════════════════════════════╣');
  lines.push('║  YOUR TAKEOUT TAX:                                           ║');
  lines.push(`║    ⏱️  Migration Hours:    ${String(report.totalMigrationHours).padEnd(32)}║`);
  lines.push(`║    💰 Opportunity Cost:   $${String(report.opportunityCost).padEnd(31)}║`);
  lines.push(`║    📉 Products Lost:      ${String(report.productsLost).padEnd(32)}║`);
  lines.push(`║    ⚠️  High Risk Data:     ${String(report.dataAtRisk + '%').padEnd(31)}║`);
  lines.push('╚══════════════════════════════════════════════════════════════╝');
  lines.push('');

  return lines.join('\n');
}

// Main execution
const TAKEOUT_PATH = process.argv[2] || '/Users/anupamchugh/Downloads/Takeout';

console.log(`\nScanning: ${TAKEOUT_PATH}\n`);

const results = scanTakeoutFolder(TAKEOUT_PATH);
const report = calculateTax(results);
console.log(formatReport(report));

// Also output raw data for debugging
console.log('\n--- Raw Scan Results ---');
for (const r of results) {
  console.log(`${r.status.toUpperCase().padEnd(8)} ${r.folder.padEnd(30)} ${r.fileCount} files`);
}
