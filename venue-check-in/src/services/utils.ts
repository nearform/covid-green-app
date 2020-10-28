import {parseQRCode} from './qr-code-parser';
import * as VisitedVenueStore from './visited-venue-store';

// Return true if the venue in the QR code has been added to
// the visited venue list, false otherwise.
export const parseQRCodeAndSaveVenue = async (
  qrCodeData: string
): Promise<boolean> => {
  const venue = await parseQRCode(qrCodeData);

  return await VisitedVenueStore.addNewVenue({
    id: venue.id,
    name: venue.venueName,
    address: venue.venueAddress
  });
};
