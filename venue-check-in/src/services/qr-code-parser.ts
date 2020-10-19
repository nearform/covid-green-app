import {
  QR_CODE_CONSTANT,
  QR_CODE_FIELD_DELIMITER,
  QR_CODE_MIN_VERSION
} from './constants';
import jwt_decode from 'jwt-decode';
import jsrsasign from 'jsrsasign';
import {publicKey} from '../../qr-public.pem';

interface ParsedVenue {
  iat: string;
  id: string;
  venueAddress: string;
  venueName: string;
}

const isVersionSupported = (version: string) =>
  parseInt(version, 10) >= QR_CODE_MIN_VERSION;

const parseJWT = async (jwt: string): Promise<ParsedVenue> => {
  const parts = jwt.split('.');
  if (parts.length !== 3) {
    throw 'Error parsing JWT';
  }
  const payload = jwt_decode<ParsedVenue>(jwt);

  return payload;
};

const verifySignature = async (jwtString: string) => {
  const isValid = jsrsasign.KJUR.jws.JWS.verify(jwtString, publicKey, [
    'ES256'
  ]);
  if (!isValid) {
    throw 'Invalid signature';
  }
};

export const parseQRCode = async (value: string): Promise<ParsedVenue> => {
  const fields = value.split(QR_CODE_FIELD_DELIMITER);
  if (fields.length !== 3) {
    throw 'Invalid QR code value';
  }

  const [constant, version, jwtString] = fields;
  if (constant !== QR_CODE_CONSTANT) {
    throw 'Invalid QR code value';
  }

  if (!isVersionSupported(version)) {
    throw 'Invalid version';
  }

  const jwtPayload = await parseJWT(jwtString);

  await verifySignature(jwtString);

  return jwtPayload;
};
