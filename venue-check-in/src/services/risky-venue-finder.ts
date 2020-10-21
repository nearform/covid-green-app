import {getRiskyVenues} from './api';
import {VenueID} from './common';
import * as VisitedVenueStore from './visited-venue-store';

// POC implementation of the matching function, it only retrieves
// the last visited venue and searches its ID in the risky venue list.

export const matchRiskyVenues = async (): Promise<VenueID[]> => {
  const riskyVenues = await getRiskyVenues();
  const lastVisitedVenue = await VisitedVenueStore.getLastVisitedVenue();

  if (riskyVenues.length > 0 && lastVisitedVenue !== null) {
    const matches = riskyVenues.filter(
      (riskyVenue) => riskyVenue.id === lastVisitedVenue.venue.id
    );

    if (matches.length > 0) {
      return [lastVisitedVenue.venue.id];
    }
  }

  return [];
};
