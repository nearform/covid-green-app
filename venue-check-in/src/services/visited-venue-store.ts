import * as SecureFileStorage from './secure-file-storage/secure-file-storage';
import * as DateUtils from './date-utils';
import isBefore from 'date-fns/isBefore';
import {dateToString, stringToDate} from './date-utils';

const visitedVenueStoreKey = 'visitedVenueStore';

interface Venue {
  id: string;
  name: string;
  address: string;
}

export interface VisitedVenue {
  venue: Venue;
  from: string;
  to: string;
}

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
    return visitedVenues[visitedVenues.length - 1];
  }
  return null;
};

export const removeLastVisitedVenue = async () => {
  const visitedVenues = await getVisitedVenues();
  if (visitedVenues.length > 0) {
    visitedVenues.pop();
    await saveVisitedVenues(visitedVenues);
  }
};

export const finishLastVisitAndAddNewVenue = async (newVenue: Venue) => {
  const visitedVenues = await getVisitedVenues();
  if (visitedVenues.length > 0) {
    const lastVisitedVenue = visitedVenues[0];
    const checkOutTime = DateUtils.roundUpToNearestQuarter();
    if (isBefore(checkOutTime, stringToDate(lastVisitedVenue.to))) {
      lastVisitedVenue.to = dateToString(checkOutTime);
    }
  }

  const newVisitedVenue = {
    venue: newVenue,
    from: dateToString(DateUtils.roundDownToNearestQuarter()),
    to: dateToString(DateUtils.getNextMidnight())
  };
  visitedVenues.unshift(newVisitedVenue);
  await saveVisitedVenues(visitedVenues);
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
