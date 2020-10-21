import {request, urls} from '../../external-dependencies';
import {RiskyVenue} from '../common';

export async function getRiskyVenues(): Promise<RiskyVenue[]> {
  try {
    const req = await request(`${urls.api}/venues/risky`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!req) {
      throw new Error('Invalid response');
    }

    const resp = await req.json();

    return resp.riskyVenues || [];
  } catch (err) {
    console.log('Risky venues error: ', err);
    throw err;
  }
}
