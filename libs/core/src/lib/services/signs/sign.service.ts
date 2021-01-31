import { Injectable } from '@angular/core';
import { SignApiService } from '../../api';
import { Points, Sign, SignSizes } from '../../models';

const PT1 = '-154.74763137499997,57.082179791033674';
const PT2 = '-42.42341262499997,16.8775030108846';

@Injectable({
  providedIn: 'root',
})
export class SignService {
  constructor(private signApiService: SignApiService) {}

  /**
   * Get all Signs within certain bounds
   * @param points {Points=} The outer bounds of the area
   * @param points.pt1 {string} [points.pt1=`-154.74763137499997,57.082179791033674`]
   * @param points.pt2 {string} [points.pt2=`-42.42341262499997,16.8775030108846`]
   */
  public geoQuery(
    points: Points = { pt1: PT1, pt2: PT2 }
  ): Promise<Array<Sign>> {
    return new Promise((resolve, reject) => {
      this.signApiService.geoQuery(points).subscribe(
        (result: Array<Sign>) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Get a list of sign sizes and the number of duplicates
   */
  public signSizes(signs: Array<string>): Promise<Array<SignSizes>> {
    return new Promise((resolve, reject) => {
      this.signApiService.signSizes(signs).subscribe(
        (result: Array<SignSizes>) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
