/**
 * Google Graveyard Data
 *
 * Complete list of killed Google products with migration cost estimates
 * Source: killedbygoogle.com + manual curation
 */

export interface KilledProduct {
  name: string;
  slug: string;
  dateOpen: string;      // YYYY-MM-DD
  dateClose: string;     // YYYY-MM-DD
  description: string;
  type: 'service' | 'app' | 'hardware';

  // Takeout integration
  takeoutFolder?: string;        // Folder name in Google Takeout
  takeoutAvailable: boolean;     // Was export available?

  // Migration costs (crowdsourced estimates)
  avgMigrationHours: number;
  dataLossRisk: 'low' | 'medium' | 'high';
  alternatives: string[];
}

export const GRAVEYARD: KilledProduct[] = [
  // ═══════════════════════════════════════════════════════════════
  // HIGH PROFILE DEATHS (most users affected)
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Google Reader',
    slug: 'google-reader',
    dateOpen: '2005-10-07',
    dateClose: '2013-07-01',
    description: 'RSS feed aggregator - beloved by millions',
    type: 'service',
    takeoutFolder: 'Reader',
    takeoutAvailable: true,
    avgMigrationHours: 3,
    dataLossRisk: 'low',
    alternatives: ['Feedly', 'Inoreader', 'NewsBlur'],
  },
  {
    name: 'Google+',
    slug: 'google-plus',
    dateOpen: '2011-06-28',
    dateClose: '2019-04-02',
    description: 'Social network with circles - forced on everyone',
    type: 'service',
    takeoutFolder: 'Google+ Stream',
    takeoutAvailable: true,
    avgMigrationHours: 4,
    dataLossRisk: 'high',
    alternatives: ['Facebook', 'Twitter', 'Nothing (RIP)'],
  },
  {
    name: 'Inbox by Gmail',
    slug: 'inbox-by-gmail',
    dateOpen: '2014-10-22',
    dateClose: '2019-04-02',
    description: 'Smart email with bundles, snooze, and reminders',
    type: 'app',
    takeoutFolder: 'Inbox',
    takeoutAvailable: true,
    avgMigrationHours: 2,
    dataLossRisk: 'low',
    alternatives: ['Gmail (with worse UX)', 'Spark', 'Superhuman'],
  },
  {
    name: 'Google Play Music',
    slug: 'google-play-music',
    dateOpen: '2011-05-10',
    dateClose: '2020-12-04',
    description: 'Music streaming + personal library upload (50k songs free)',
    type: 'service',
    takeoutFolder: 'Google Play Music',
    takeoutAvailable: true,
    avgMigrationHours: 6,
    dataLossRisk: 'medium',
    alternatives: ['YouTube Music (forced migration)', 'Spotify', 'Apple Music'],
  },
  {
    name: 'Google Hangouts',
    slug: 'hangouts',
    dateOpen: '2013-05-15',
    dateClose: '2022-11-01',
    description: 'Messaging and video calls - replaced 4 times',
    type: 'service',
    takeoutFolder: 'Hangouts',
    takeoutAvailable: true,
    avgMigrationHours: 3,
    dataLossRisk: 'medium',
    alternatives: ['Google Chat', 'Google Meet', 'WhatsApp', 'Signal'],
  },
  {
    name: 'Google Podcasts',
    slug: 'google-podcasts',
    dateOpen: '2018-06-18',
    dateClose: '2024-06-23',
    description: 'Podcast app - killed for YouTube Music',
    type: 'app',
    takeoutFolder: 'Google Podcasts',
    takeoutAvailable: true,
    avgMigrationHours: 1,
    dataLossRisk: 'low',
    alternatives: ['YouTube Music', 'Pocket Casts', 'Overcast', 'Apple Podcasts'],
  },
  {
    name: 'Google Stadia',
    slug: 'stadia',
    dateOpen: '2019-11-19',
    dateClose: '2023-01-18',
    description: 'Cloud gaming - "the future of gaming"',
    type: 'service',
    takeoutFolder: 'Stadia',
    takeoutAvailable: true,
    avgMigrationHours: 0, // Refunds issued
    dataLossRisk: 'high', // Game saves gone
    alternatives: ['Xbox Cloud Gaming', 'GeForce NOW', 'Buy the actual games'],
  },
  {
    name: 'Google Notes on Search',
    slug: 'notes-on-search',
    dateOpen: '2023-11-01',
    dateClose: '2024-07-31',
    description: 'Add notes to search results - Labs experiment',
    type: 'service',
    takeoutFolder: 'Notes',
    takeoutAvailable: true,
    avgMigrationHours: 0.5,
    dataLossRisk: 'high', // Most people didn\'t export
    alternatives: ['Nothing - feature doesn\'t exist elsewhere'],
  },

  // ═══════════════════════════════════════════════════════════════
  // MESSAGING GRAVEYARD (Google's specialty)
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Google Allo',
    slug: 'google-allo',
    dateOpen: '2016-09-21',
    dateClose: '2019-03-13',
    description: 'Messaging app with Google Assistant',
    type: 'app',
    takeoutFolder: 'Google Allo',
    takeoutAvailable: true,
    avgMigrationHours: 2,
    dataLossRisk: 'high',
    alternatives: ['Messages', 'WhatsApp', 'Signal'],
  },
  {
    name: 'Google Talk',
    slug: 'google-talk',
    dateOpen: '2005-08-24',
    dateClose: '2017-06-26',
    description: 'XMPP-based chat - actually had open standards',
    type: 'service',
    takeoutFolder: 'Google Talk',
    takeoutAvailable: false,
    avgMigrationHours: 1,
    dataLossRisk: 'medium',
    alternatives: ['Hangouts (also dead)', 'Signal'],
  },
  {
    name: 'Google Wave',
    slug: 'google-wave',
    dateOpen: '2009-05-27',
    dateClose: '2012-04-30',
    description: 'Real-time collaboration - too ahead of its time',
    type: 'service',
    takeoutFolder: 'Wave',
    takeoutAvailable: true,
    avgMigrationHours: 2,
    dataLossRisk: 'high',
    alternatives: ['Google Docs', 'Notion', 'Slack'],
  },

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTIVITY DEATHS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Google Bookmarks',
    slug: 'google-bookmarks',
    dateOpen: '2005-10-10',
    dateClose: '2021-09-30',
    description: 'Web bookmark syncing service',
    type: 'service',
    takeoutFolder: 'Bookmarks',
    takeoutAvailable: true,
    avgMigrationHours: 1,
    dataLossRisk: 'low',
    alternatives: ['Chrome bookmarks', 'Raindrop.io', 'Pinboard'],
  },
  {
    name: 'Google Code',
    slug: 'google-code',
    dateOpen: '2006-07-27',
    dateClose: '2016-01-25',
    description: 'Project hosting - before GitHub won',
    type: 'service',
    takeoutFolder: undefined,
    takeoutAvailable: false,
    avgMigrationHours: 4,
    dataLossRisk: 'medium',
    alternatives: ['GitHub', 'GitLab', 'Bitbucket'],
  },
  {
    name: 'Picasa',
    slug: 'picasa',
    dateOpen: '2004-07-15',
    dateClose: '2016-05-01',
    description: 'Photo organizing and editing',
    type: 'app',
    takeoutFolder: 'Picasa',
    takeoutAvailable: true,
    avgMigrationHours: 3,
    dataLossRisk: 'low',
    alternatives: ['Google Photos', 'Adobe Lightroom', 'Apple Photos'],
  },

  // ═══════════════════════════════════════════════════════════════
  // HARDWARE GRAVEYARD
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'Chromecast Audio',
    slug: 'chromecast-audio',
    dateOpen: '2015-09-29',
    dateClose: '2019-01-11',
    description: 'Audio-only Chromecast - beloved by audiophiles',
    type: 'hardware',
    takeoutFolder: undefined,
    takeoutAvailable: false,
    avgMigrationHours: 2,
    dataLossRisk: 'low',
    alternatives: ['Chromecast (full)', 'Sonos', 'AirPlay'],
  },
  {
    name: 'Google Glass (Consumer)',
    slug: 'google-glass',
    dateOpen: '2013-04-15',
    dateClose: '2015-01-19',
    description: 'Smart glasses - "Glassholes"',
    type: 'hardware',
    takeoutFolder: undefined,
    takeoutAvailable: false,
    avgMigrationHours: 0,
    dataLossRisk: 'low',
    alternatives: ['Meta Ray-Ban', 'Nothing'],
  },
  {
    name: 'Nest Secure',
    slug: 'nest-secure',
    dateOpen: '2017-09-20',
    dateClose: '2024-04-08',
    description: 'Home security system - bricked remotely',
    type: 'hardware',
    takeoutFolder: undefined,
    takeoutAvailable: false,
    avgMigrationHours: 8,
    dataLossRisk: 'high',
    alternatives: ['Ring', 'SimpliSafe', 'ADT'],
  },

  // ═══════════════════════════════════════════════════════════════
  // MISC DEATHS
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'YouTube Gaming',
    slug: 'youtube-gaming',
    dateOpen: '2015-08-26',
    dateClose: '2019-05-30',
    description: 'Gaming-focused YouTube - lost to Twitch',
    type: 'service',
    takeoutFolder: undefined,
    takeoutAvailable: false,
    avgMigrationHours: 1,
    dataLossRisk: 'low',
    alternatives: ['YouTube (main)', 'Twitch'],
  },
  {
    name: 'Google Trips',
    slug: 'google-trips',
    dateOpen: '2016-09-19',
    dateClose: '2019-08-05',
    description: 'Travel planning and itineraries',
    type: 'app',
    takeoutFolder: 'Trips',
    takeoutAvailable: true,
    avgMigrationHours: 1,
    dataLossRisk: 'medium',
    alternatives: ['Google Maps', 'TripIt', 'Wanderlog'],
  },
  {
    name: 'Google Domains',
    slug: 'google-domains',
    dateOpen: '2015-01-13',
    dateClose: '2023-09-07',
    description: 'Domain registrar - sold to Squarespace',
    type: 'service',
    takeoutFolder: undefined,
    takeoutAvailable: false,
    avgMigrationHours: 2,
    dataLossRisk: 'low',
    alternatives: ['Squarespace Domains (forced)', 'Cloudflare', 'Namecheap'],
  },
  {
    name: 'Google+',
    slug: 'google-plus-photos',
    dateOpen: '2013-05-15',
    dateClose: '2015-08-01',
    description: 'Google+ Photos - became Google Photos',
    type: 'service',
    takeoutFolder: 'Google+ Photos',
    takeoutAvailable: true,
    avgMigrationHours: 0,
    dataLossRisk: 'low',
    alternatives: ['Google Photos (automatic migration)'],
  },
];

// Mapping of Takeout folder names to product slugs
export const TAKEOUT_FOLDER_MAP: Record<string, string> = {};
GRAVEYARD.forEach(product => {
  if (product.takeoutFolder) {
    TAKEOUT_FOLDER_MAP[product.takeoutFolder] = product.slug;
    TAKEOUT_FOLDER_MAP[product.takeoutFolder.toLowerCase()] = product.slug;
  }
});

// Products still alive (for context in reports)
export const ALIVE_PRODUCTS = [
  'Gmail', 'Drive', 'Photos', 'YouTube', 'Maps', 'Chrome',
  'Calendar', 'Contacts', 'Keep', 'Tasks', 'Fit', 'Home',
  'Timeline', 'Voice', 'Blogger', 'Groups', 'Meet', 'Chat',
  'Docs', 'Sheets', 'Slides', 'Forms', 'Sites', 'Classroom',
];

// Get product by slug
export function getProduct(slug: string): KilledProduct | undefined {
  return GRAVEYARD.find(p => p.slug === slug);
}

// Get product by Takeout folder name
export function getProductByFolder(folderName: string): KilledProduct | undefined {
  const slug = TAKEOUT_FOLDER_MAP[folderName] || TAKEOUT_FOLDER_MAP[folderName.toLowerCase()];
  return slug ? getProduct(slug) : undefined;
}

// Get all products killed in a year
export function getKilledInYear(year: number): KilledProduct[] {
  return GRAVEYARD.filter(p => {
    const closeYear = parseInt(p.dateClose.split('-')[0]);
    return closeYear === year;
  });
}

// Calculate total death count
export function getDeathCount(): number {
  return GRAVEYARD.length;
}

// Calculate lifespan in days
export function getLifespan(product: KilledProduct): number {
  const open = new Date(product.dateOpen);
  const close = new Date(product.dateClose);
  return Math.floor((close.getTime() - open.getTime()) / (1000 * 60 * 60 * 24));
}
