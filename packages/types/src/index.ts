export interface KilledService {
  id: string;
  name: string;
  slug: string;
  company: string;
  category: string;
  dateOpen: Date;
  dateClose: Date;
  announcementDate?: Date;
  description: string;
  reasonForShutdown?: string;
  alternatives: string[];
}

export interface LocationEntry {
  id: string;
  userId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  accuracy: number;
  placeName?: string;
  address?: string;
  placeType?: string;
  duration_ms?: number;
}

export interface ServiceDeathTimeline {
  service: KilledService;
  userLocation?: LocationEntry;
  narrative: string;
  wasNearby: boolean;
  proximityDays: number;
}
