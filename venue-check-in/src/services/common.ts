export type VenueID = string;

export interface Venue {
  id: VenueID;
  name: string;
  address: string;
}

export interface VisitedVenue {
  venue: Venue;
  from: string;
}

export interface RiskyVenue {
  id: VenueID;
  from: string;
  to: string;
}
