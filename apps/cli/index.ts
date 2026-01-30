import * as fs from 'fs';
import * as path from 'path';
import type { KilledService, LocationEntry } from '@graveyard/types';
import { TakeoutParser } from '@graveyard/takeout';
import { CorrelationEngine } from '@graveyard/correlation';

// Load sample data
const SAMPLE_SERVICES: KilledService[] = [
  {
    id: '1',
    name: 'Google Inbox',
    slug: 'google-inbox',
    company: 'Google',
    category: 'communication',
    dateOpen: new Date('2014-10-22'),
    dateClose: new Date('2019-03-22'),
    description: 'Email management with bundling and snooze features',
    reasonForShutdown: 'Merged features into Gmail',
    alternatives: ['Gmail', 'Outlook'],
  },
  {
    id: '2',
    name: 'Google Reader',
    slug: 'google-reader',
    company: 'Google',
    category: 'productivity',
    dateOpen: new Date('2005-10-20'),
    dateClose: new Date('2013-07-01'),
    description: 'RSS feed aggregator',
    reasonForShutdown: 'Low usage, focus shift to Google+',
    alternatives: ['Feedly', 'Inoreader'],
  },
  {
    id: '3',
    name: 'Google Play Music',
    slug: 'google-play-music',
    company: 'Google',
    category: 'media',
    dateOpen: new Date('2011-11-08'),
    dateClose: new Date('2020-12-04'),
    description: 'Music streaming and library storage',
    reasonForShutdown: 'Consolidation into YouTube Music',
    alternatives: ['Spotify', 'YouTube Music', 'Apple Music'],
  },
  {
    id: '4',
    name: 'Google Hangouts',
    slug: 'google-hangouts',
    company: 'Google',
    category: 'communication',
    dateOpen: new Date('2013-05-15'),
    dateClose: new Date('2022-11-01'),
    description: 'Video chat and messaging platform',
    reasonForShutdown: 'Replaced by Meet and Chat',
    alternatives: ['Google Meet', 'Slack'],
  },
];

// Sample location history
const SAMPLE_LOCATIONS: LocationEntry[] = [
  {
    id: 'loc-1',
    userId: 'demo-user',
    timestamp: new Date('2019-03-20'),
    latitude: 35.6762,
    longitude: 139.6503,
    accuracy: 50,
    placeName: 'Tokyo, Japan',
    address: 'Chiyoda, Tokyo, Japan',
  },
  {
    id: 'loc-2',
    userId: 'demo-user',
    timestamp: new Date('2019-03-21'),
    latitude: 35.6895,
    longitude: 139.6917,
    accuracy: 50,
    placeName: 'Tokyo, Japan',
    address: 'Shibuya, Tokyo, Japan',
  },
  {
    id: 'loc-3',
    userId: 'demo-user',
    timestamp: new Date('2019-03-22'),
    latitude: 35.7246,
    longitude: 139.7382,
    accuracy: 50,
    placeName: 'Tokyo, Japan',
    address: 'Asakusa, Tokyo, Japan',
  },
  {
    id: 'loc-4',
    userId: 'demo-user',
    timestamp: new Date('2013-06-28'),
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 50,
    placeName: 'San Francisco, CA',
    address: 'San Francisco, California, USA',
  },
  {
    id: 'loc-5',
    userId: 'demo-user',
    timestamp: new Date('2013-06-29'),
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 50,
    placeName: 'San Francisco, CA',
    address: 'San Francisco, California, USA',
  },
  {
    id: 'loc-6',
    userId: 'demo-user',
    timestamp: new Date('2013-07-01'),
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 50,
    placeName: 'San Francisco, CA',
    address: 'San Francisco, California, USA',
  },
  {
    id: 'loc-7',
    userId: 'demo-user',
    timestamp: new Date('2020-12-02'),
    latitude: 51.5074,
    longitude: -0.1278,
    accuracy: 50,
    placeName: 'London, UK',
    address: 'London, United Kingdom',
  },
  {
    id: 'loc-8',
    userId: 'demo-user',
    timestamp: new Date('2020-12-04'),
    latitude: 51.5074,
    longitude: -0.1278,
    accuracy: 50,
    placeName: 'London, UK',
    address: 'London, United Kingdom',
  },
];

function main() {
  console.log('🪦 WHERE I WAS: Service Death Timeline Generator\n');
  console.log('═'.repeat(60));
  console.log('');

  // Build timeline
  const timeline = CorrelationEngine.buildTimeline(SAMPLE_SERVICES, SAMPLE_LOCATIONS);

  if (timeline.length === 0) {
    console.log('No service deaths found in your location history.');
    return;
  }

  timeline.forEach((event, idx) => {
    console.log(`[${idx + 1}] ${event.service.dateClose.toLocaleDateString()} - ${event.service.name}`);
    console.log(`    📍 ${event.narrative}`);
    if (event.userLocation) {
      console.log(`    📌 Coordinates: ${event.userLocation.latitude.toFixed(4)}, ${event.userLocation.longitude.toFixed(4)}`);
    }
    console.log('');
  });

  // Summary stats
  console.log('═'.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total services died during your travels: ${timeline.length}`);
  console.log(`   Services near your location (within 3 days): ${timeline.filter((t) => t.wasNearby).length}`);
  
  // Most services in one location
  const locationCounts = new Map<string, number>();
  timeline.forEach((event) => {
    if (event.userLocation?.placeName) {
      const count = (locationCounts.get(event.userLocation.placeName) || 0) + 1;
      locationCounts.set(event.userLocation.placeName, count);
    }
  });

  if (locationCounts.size > 0) {
    const mostServices = Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];
    console.log(`   Most services died while in one place: ${mostServices[1]} in ${mostServices[0]}`);
  }

  console.log('\n✨ Demo complete. Replace SAMPLE_LOCATIONS with real Takeout data to see your timeline.\n');
}

main();
