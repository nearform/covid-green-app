import {parseQRCode} from './qr-code-parser';
import * as VisitedVenueStore from './visited-venue-store';

export const parseQRCodeAndSaveVenue = async (qrCodeData: string) => {
  const venue = await parseQRCode(qrCodeData);

  await VisitedVenueStore.finishLastVisitAndAddNewVenue({
    id: venue.id,
    name: venue.venueName,
    address: venue.venueAddress
  });
};
