import {QR_CODE_JWT_URL_PARAM, QR_CODE_MIN_VERSION} from './constants';
import jwt_decode from 'jwt-decode';
import jsrsasign from 'jsrsasign';
import {publicKey} from '../../qr-public.pem';
import {QR_CODE_URL} from './constants';

interface ParsedVenue {
  iat: string;
  id: string;
  version: number;
  venueAddress: string;
  venueName: string;
}

const getJWT = (url: string): string => {
  const matches = url.match(`${QR_CODE_JWT_URL_PARAM}=([^&]*)`);
  if (matches === null || matches[1] === null) {
    throw 'Invalid QR code value';
  }
  const jwt = matches[1];

  return jwt;
};

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

const isVersionSupported = (jwt: ParsedVenue) =>
  jwt.version >= QR_CODE_MIN_VERSION;

export const parseQRCode = async (url: string): Promise<ParsedVenue> => {
  if (!url.startsWith(QR_CODE_URL)) {
    throw 'Invalid QR code value 1';
  }

  const jwt = getJWT(url);

  const jwtPayload = await parseJWT(jwt);

  await verifySignature(jwt);

  if (!isVersionSupported(jwtPayload)) {
    throw 'Invalid version';
  }

  return jwtPayload;
};
