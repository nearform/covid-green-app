import i18n from 'i18next';
import PushNotification from 'react-native-push-notification';
import {getRiskyVenues} from './api';
import {VenueID} from './common';
import * as VisitedVenueStore from './visited-venue-store';

// It retrieves the last visited venue and searches its ID in the risky venue list.
// This implementation was developed for a first version of the POC, but the current
// POC does not use it.
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

export const showRiskyVenueNotification = () => {
  PushNotification.localNotification({
    title: i18n.t('venueCheckIn:notification:title'),
    message: i18n.t('venueCheckIn:notification:message')
  });
};

export const isRiskyVenueNotificaton = (notification: any) =>
  notification &&
  notification.title === i18n.t('venueCheckIn:notification:title') &&
  notification.message === i18n.t('venueCheckIn:notification:message');
