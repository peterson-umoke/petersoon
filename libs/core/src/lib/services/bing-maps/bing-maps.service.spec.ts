import { Environment } from '../../models';
import { BingMapsService } from './bing-maps.service';

describe('BingMapsService', () => {
  let service: BingMapsService;
  beforeEach(() => {
    service = new BingMapsService(<Environment>{});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a rejected Promise', async () => {
    try {
      await service.getZipCoordinates('3000');
      throw Error('The promise was not rejected and a result was returned');
    } catch (error) {
      expect(error).toEqual('Zip Code is not 5 digits');
    }
  });

  // TODO: These tests are testing the api not a stubbed response
  // it('should return an empty list for an invalid zip code', async () => {
  //   const coordinates = await service.getZipCoordinates('8404a');
  //   expect(coordinates).toEqual([]);
  // });

  // it('should return a valid list of coordinates for a valid zip code', async () => {
  //   const service: BingMapsService = TestBed.inject(BingMapsService);
  //   const coordinates = await service.getZipCoordinates('84042');
  //   expect(coordinates.length).toBeGreaterThan(0);
  // });

  it('should parse a valid compressed string', () => {
    const coordinates = service.tryParseEncodedValue(
      'wjxmuk7zkN3mpBnwBx-7Bx1BgrFslDqryHg2vBmwLhjD95oH6t2D96xFz0_Bn1D24sCvxkIkm9bu_rMxO94qVi9vN50hBxz3yB71X2mHjlC_rNxowDstrF8z3B2qFumB7irM7m0nFl8mpB_h-a3M-_5Hiqneu-qnJi4s5BgdwisLit7F_gjC_y2Fi0m1D9vZp2Hh4M3oE0w7GnsVsgRpl9BvWhlBs7Hpg9xBwxq7CinU8qBg2wCj_L5jlFpnDj9mC2iBxairnEn9oBp6F26Rl8Dns4YmzElnmPmriLn2gLkiyFr0ClxDlgBgvrBwz-I1qFo2mMiznwB-wTim9By-K8HhhiBuuNpmbhw4yB4qnlB10Rj3Vr_M98apiBx-lBrXolDlvgDx82dy8mZpldq5lfxl3Fy4H9gC'
    );
    expect(coordinates.length).toBeGreaterThan(0);
  });

  it('should return an empty list for an invalid string', () => {
    const coordinates = service.tryParseEncodedValue(
      '1,wjxmuk7zkN3mpBnwBx-7Bx1BgrFslDqryHg2vBmwLhjD95oH6t2D96xFz0_Bn1D24sCvxkIkm9bu_rMxO94qVi9vN50hBxz3yB71X2mHjlC_rNxowDstrF8z3B2qFumB7irM7m0nFl8mpB_h-a3M-_5Hiqneu-qnJi4s5BgdwisLit7F_gjC_y2Fi0m1D9vZp2Hh4M3oE0w7GnsVsgRpl9BvWhlBs7Hpg9xBwxq7CinU8qBg2wCj_L5jlFpnDj9mC2iBxairnEn9oBp6F26Rl8Dns4YmzElnmPmriLn2gLkiyFr0ClxDlgBgvrBwz-I1qFo2mMiznwB-wTim9By-K8HhhiBuuNpmbhw4yB4qnlB10Rj3Vr_M98apiBx-lBrXolDlvgDx82dy8mZpldq5lfxl3Fy4H9gC'
    );
    expect(coordinates).toEqual([]);
  });
});
