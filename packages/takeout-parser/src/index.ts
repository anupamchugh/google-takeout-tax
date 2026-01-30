import * as fs from 'fs';
import * as path from 'path';
import type { LocationEntry } from '@graveyard/types';

export class TakeoutParser {
  /**
   * Parse semantic location history from Google Takeout JSON
   */
  static parseLocationHistory(filePath: string): LocationEntry[] {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const locations: LocationEntry[] = [];

      if (!data.locations) {
        return [];
      }

      data.locations.forEach((loc: any, idx: number) => {
        // Google stores lat/lng as integers (E7 format)
        const latitude = loc.latitudeE7 / 1e7;
        const longitude = loc.longitudeE7 / 1e7;
        const timestamp = new Date(parseInt(loc.timestampMs));

        locations.push({
          id: `loc-${idx}`,
          userId: 'current-user',
          timestamp,
          latitude,
          longitude,
          accuracy: loc.accuracy || 0,
          placeName: loc.placeName,
          address: loc.address,
        });
      });

      return locations.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } catch (error) {
      console.error('Failed to parse location history:', error);
      return [];
    }
  }

  /**
   * Get locations during a date range
   */
  static getLocationsDuring(
    locations: LocationEntry[],
    startDate: Date,
    endDate: Date
  ): LocationEntry[] {
    return locations.filter(
      (loc) => loc.timestamp >= startDate && loc.timestamp <= endDate
    );
  }

  /**
   * Get most likely location during a date range (by density)
   */
  static getMostLikelyLocation(
    locations: LocationEntry[],
    startDate: Date,
    endDate: Date
  ): LocationEntry | null {
    const filtered = this.getLocationsDuring(locations, startDate, endDate);
    if (filtered.length === 0) return null;

    // Group by approximate place
    const places = new Map<string, LocationEntry[]>();
    filtered.forEach((loc) => {
      const key = `${Math.round(loc.latitude * 100)}-${Math.round(loc.longitude * 100)}`;
      if (!places.has(key)) places.set(key, []);
      places.get(key)!.push(loc);
    });

    // Return location from place with most entries
    let maxPlace = null;
    let maxCount = 0;
    places.forEach((locs, _key) => {
      if (locs.length > maxCount) {
        maxCount = locs.length;
        maxPlace = locs[0];
      }
    });

    return maxPlace;
  }
}
