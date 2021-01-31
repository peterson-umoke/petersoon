import { Injectable } from '@angular/core';
import * as bigInt from 'big-integer';
import { Environment } from '../../models';

export interface Coordinate {
  lat: number;
  lng: number;
}

@Injectable()
export class BingMapsService {
  private bingMapsKey: string;
  private safeCharacters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  // example { "84003": ["asdf"] }
  private searchedZipCodes = {};

  constructor(private environment: Environment) {
    this.bingMapsKey = environment.BING_MAPS_KEY;
  }

  public async getZipCoordinates(
    zipCode: string
  ): Promise<Array<Array<Coordinate>>> {
    if (zipCode.length !== 5) {
      return new Promise((resolve, reject) => {
        reject('Zip Code is not 5 digits');
      });
    }
    if (zipCode in this.searchedZipCodes) {
      return new Promise((resolve, reject) => {
        const coordinateList = [];
        this.searchedZipCodes[zipCode].forEach((compressedString) => {
          const coordinates = this.tryParseEncodedValue(compressedString);
          coordinateList.push(coordinates);
        });
        resolve(coordinateList);
      });
    }
    return fetch(
      `https://platform.bing.com/geo/spatial/v1/public/Geodata?SpatialFilter=GetBoundary('${zipCode}',3,'PostCode1',0,0,'en-US','us')&$format=json&key=${this.bingMapsKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        if ('error' in data) {
          return [];
        }
        const coordinateList = [];

        // Many polygons could be returned to represent a zip code
        data.d.results[0].Primitives.forEach((primitive) => {
          // commas delimit the valid string.
          const firstComma = primitive.Shape.indexOf(',');
          const secondComma = primitive.Shape.indexOf(',', firstComma + 1);

          // Grab the characters between each comma
          const compressedString = primitive.Shape.substring(
            firstComma + 1,
            secondComma !== -1 ? secondComma : primitive.Shape.length
          );
          if (zipCode in this.searchedZipCodes) {
            this.searchedZipCodes[zipCode].append(compressedString);
          } else {
            this.searchedZipCodes[zipCode] = [compressedString];
          }
          const coordinates = this.tryParseEncodedValue(compressedString);
          coordinateList.push(coordinates);
        });
        return coordinateList;
      })
      .catch(function(error) {
        console.log(error);
        return [];
      });
  }

  public tryParseEncodedValue(value): Array<Coordinate> {
    const list = [];
    let index = 0;
    let xsum = 0;
    let ysum = 0;

    while (index < value.length) {
      let n: any = bigInt(0); // initialize the accumulator

      let k = 0; // initialize the count of bits

      while (true) {
        if (index >= value.length) {
          // If we ran out of data mid-number
          return [];
        } // indicate failure.

        const b = this.safeCharacters.indexOf(value[index++]);

        if (b === -1) {
          // If the character wasn't on the valid list, indicate failure.
          return [];
        }

        n = bigInt(n).or(
          bigInt(b)
            .and(31)
            .shiftLeft(k)
        ); // mask off the top bit and append the rest to the accumulator

        k += 5; // move to the next position
        if (b < 32) {
          break;
        } // If the top bit was not set, we're done with this number.
      }

      // The resulting number encodes an x, y pair in the following way:
      //
      //  ^ Y
      //  |
      //  14
      //  9 13
      //  5 8 12
      //  2 4 7 11
      //  0 1 3 6 10 ---> X
      // determine which diagonal it's on
      const diagonal = Math.trunc((Math.sqrt(8 * n + 5) - 1) / 2);

      // subtract the total number of points from lower diagonals
      n -= (diagonal * (diagonal + 1)) / 2;

      // get the X and Y from what's left over
      let ny = bigInt(n).toJSNumber();
      let nx = diagonal - ny;

      // undo the sign encoding
      // tslint:disable: no-bitwise
      nx = (nx >> 1) ^ -(nx & 1);
      ny = (ny >> 1) ^ -(ny & 1);

      // undo the delta encoding
      xsum += nx;
      ysum += ny;

      // position the decimal point
      list.push({
        lat: ysum * 0.00001,
        lng: xsum * 0.00001,
      });
    }

    return list;
  }
}
