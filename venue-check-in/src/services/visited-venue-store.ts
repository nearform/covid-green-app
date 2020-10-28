import * as SecureFileStorage from './secure-file-storage/secure-file-storage';
import * as DateUtils from './date-utils';
import {VisitedVenue, Venue} from './common';
import {SAME_VENUE_CHECKIN_INTERVAL_IN_MINUTES} from './constants';

const visitedVenueStoreKey = 'visitedVenueStore';

const saveVisitedVenues = async (newVisitedVenues: VisitedVenue[]) => {
  const visitedVenues = JSON.stringify(newVisitedVenues);
  await SecureFileStorage.setItem(visitedVenueStoreKey, visitedVenues);
};

export const getVisitedVenues = async (): Promise<VisitedVenue[]> => {
  const visiteVenueStore = await SecureFileStorage.getItem(
    visitedVenueStoreKey
  );
  try {
    return JSON.parse(visiteVenueStore);
  } catch (err) {
    return [];
  }
};

export const getLastVisitedVenue = async (): Promise<VisitedVenue | null> => {
  const visitedVenues = await getVisitedVenues();
  if (visitedVenues.length > 0) {
    return visitedVenues[0];
  }
  return null;
};

export const removeLastVisitedVenue = async () => {
  const visitedVenues = await getVisitedVenues();
  if (visitedVenues.length > 0) {
    visitedVenues.shift();
    await saveVisitedVenues(visitedVenues);
  }
};

const shouldAddNewVenue = (
  visitedVenues: VisitedVenue[],
  newVisitedVenue: VisitedVenue
): boolean => {
  if (visitedVenues.length === 0) {
    // If the venue lists is empty, you can add the new one
    return true;
  } else {
    const lastVisitedVenue = visitedVenues[0];
    if (lastVisitedVenue.venue.id !== newVisitedVenue.venue.id) {
      // If the venue list is not empty but the last venue checked-in
      // is different from the new one, you can add it
      return true;
    } else {
      // If the last venue checked-in is the same, you can add a second
      // check-in only if it occurs after an interval
      const diff = DateUtils.isFirstDateAfterSecondDate(
        newVisitedVenue.from,
        lastVisitedVenue.from,
        SAME_VENUE_CHECKIN_INTERVAL_IN_MINUTES
      );

      return diff;
    }
  }
};

// Add the new venue to the visited venue list only if it meets some requirements.
// Returns true if the venue hase been added, false otherwise
export const addNewVenue = async (newVenue: Venue): Promise<boolean> => {
  const visitedVenues = await getVisitedVenues();
  const newVisitedVenue: VisitedVenue = {
    venue: newVenue,
    from: DateUtils.getCurrentTime()
  };

  if (shouldAddNewVenue(visitedVenues, newVisitedVenue)) {
    visitedVenues.unshift(newVisitedVenue);
    await saveVisitedVenues(visitedVenues);
    return true;
  }

  return false;
};

export const deleteVenue = async (index: number): Promise<VisitedVenue[]> => {
  const visitedVenues = await getVisitedVenues();
  if (index >= 0 && index < visitedVenues.length) {
    visitedVenues.splice(index, 1);
    await saveVisitedVenues(visitedVenues);
    return visitedVenues;
  }
  return [];
};

export const deleteAllVenues = async (): Promise<VisitedVenue[]> => {
  await saveVisitedVenues([]);
  return [];
};
