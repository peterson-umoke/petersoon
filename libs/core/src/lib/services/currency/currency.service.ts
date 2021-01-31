import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor() {}

  /**
   * Takes a string and removes all leading zero's and characters other than "."
   * Then removes all characters more than two decimal places
   * @param value {string}
   * @param options {Object=}
   * @param options.maxDigits {number=} [maxDigits=6] -
   * The maximum amount of digits that will be returned preceeding cents
   * @param options.commas {boolean=} [commas=true] - Add comma's to the returned string
   * @example 1962 -> 1,962 | 100.987 -> 100.98
   */
  public format(
    value: string,
    options: { maxDigits?: number; commas?: boolean } = {
      maxDigits: 9,
      commas: true,
    }
  ): string {
    if (typeof value === 'number') {
      value = String(value);
    }
    // Remove any non digits and leading zero's
    value = value.replace(/[^\d|\.]|^0/g, '');

    // Limit the number of digits that can be entered
    const replace = new RegExp(`(^\\d{${options.maxDigits}})(\\d*)`);
    value = value.replace(replace, '$1');

    // Add commas for easy readability
    if (options.commas) {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Only allow up to two decimal places
    if (value.match(/\d*\.\d*/g)) {
      const arr = value.split('.');
      arr[1] = arr[1].substr(0, 2);
      value = new Array(arr[0], arr[1]).join('.');
    }

    // Add trailing zeros for cents
    if (value.match(/\d*\.\d$/g)) {
      value += '0';
    }

    // Add leading zero if just cents
    if (value.match(/^\.\d*/g)) {
      value = '0' + value;
    }

    // Add trailing decimal and zeros for plain dollars
    if (value.match(/^\d*$/g)) {
      value += '.00';
    }

    return value;
  }

  /**
   * Takes a number and removes commas and returns a number
   *
   * @example
   * toNumber('1,193.92') => 1193.92
   *
   * @param value
   */
  public toNumber(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }
    return value ? parseFloat(value.replace(/,/g, '')) : null;
  }
}
