import type { KilledService, LocationEntry, ServiceDeathTimeline } from '@graveyard/types';
import { TakeoutParser } from '@graveyard/takeout';

export class CorrelationEngine {
  /**
   * Find where user was when a service died
   */
  static whereWasI(
    service: KilledService,
    locations: LocationEntry[]
  ): ServiceDeathTimeline {
    const shutdownDate = service.dateClose;
    
    // Look for user location within 7 days of shutdown
    const startDate = new Date(shutdownDate);
    startDate.setDate(startDate.getDate() - 3);
    
    const endDate = new Date(shutdownDate);
    endDate.setDate(endDate.getDate() + 3);

    const userLocation = TakeoutParser.getMostLikelyLocation(locations, startDate, endDate);
    
    if (!userLocation) {
      return {
        service,
        narrative: `${service.name} was killed on ${shutdownDate.toLocaleDateString()}, but no location data available for that week.`,
        wasNearby: false,
        proximityDays: 0,
      };
    }

    // Determine narrative
    const locationName = userLocation.placeName || 
      `${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}`;
    
    const daysFromShutdown = Math.abs(
      Math.floor((userLocation.timestamp.getTime() - shutdownDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const narrative = daysFromShutdown === 0
      ? `You were in ${locationName} the exact day ${service.name} was killed (${shutdownDate.toLocaleDateString()}).`
      : `You were in ${locationName} when ${service.name} was killed on ${shutdownDate.toLocaleDateString()} (${daysFromShutdown} days apart).`;

    return {
      service,
      userLocation,
      narrative,
      wasNearby: daysFromShutdown <= 3,
      proximityDays: daysFromShutdown,
    };
  }

  /**
   * Build full timeline of service deaths with user locations
   */
  static buildTimeline(
    services: KilledService[],
    locations: LocationEntry[]
  ): ServiceDeathTimeline[] {
    return services
      .map((service) => this.whereWasI(service, locations))
      .filter((event) => event.userLocation !== undefined)
      .sort((a, b) => a.service.dateClose.getTime() - b.service.dateClose.getTime());
  }
}
