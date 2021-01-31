import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private previous = '';
  constructor() {}

  /**
   * Removes any non-digits in the string
   * @param ccNumber {string}
   */
  public formatCreditCardNumber(
    ccNumber: string
  ): { number: string; type: string } {
    // Remove any non digits
    ccNumber = ccNumber.replace(/\D/g, '');
    return this.determineCreditCard(ccNumber);
  }

  /**
   * Takes a string and formats it into mm/yyyy
   * @param yearMonth - The string to be formatted
   * @param options
   * @param options.yearLength [yearLength=4] - The length that the year should be trimmed to
   */
  public formatMonthYear(
    yearMonth: string,
    options: { yearLength: number } = { yearLength: 4 }
  ): string {
    if (this.previous.length === 3 && yearMonth.length === 2) {
      this.previous = yearMonth.substr(0, 1);
      return this.previous;
    }

    // Remove any non digits
    yearMonth = yearMonth.replace(/\D/g, '');
    const month = yearMonth.substr(0, 2);
    const year = yearMonth.substr(2, options.yearLength);
    if (yearMonth.length === 1) {
      this.previous = month;
      return this.previous;
    } else if (yearMonth.length === 2) {
      this.previous = `${month}/`;
      return this.previous;
    }
    this.previous = `${month}/${year}`;
    return this.previous;
  }

  /**
   * Determines which card is being entered
   * @param ccNumber {string}
   */
  private determineCreditCard(
    ccNumber: string
  ): { number: string; type: string } {
    let type: string;

    if (/^5[1-5]/.test(ccNumber)) {
      // Master Card
      ccNumber = this.unspecific(ccNumber);
      type = 'master';
    } else if (/^4/.test(ccNumber)) {
      // Visa
      ccNumber = this.unspecific(ccNumber);
      type = 'visa';
    } else if (/^3[47]/.test(ccNumber)) {
      // American Express
      ccNumber = this.amex(ccNumber);
      type = 'amex';
    } else if (/3(?:0[0-5]|[68][0-9])[0-9]{11}/.test(ccNumber)) {
      // Diners Club
      ccNumber = this.diners(ccNumber);
      type = 'diners';
    } else if (/6(?:011|5[0-9]{2})[0-9]{12}/.test(ccNumber)) {
      // Discover
      ccNumber = this.unspecific(ccNumber);
      type = 'discover';
    } else {
      // Unknown
      ccNumber = this.unspecific(ccNumber);
      type = 'unknown';
    }

    return { number: ccNumber, type: type };
  }

  /**
   * Format the number to '9999 999999 99999' for American Express
   * @param ccNumber {string}
   */
  private amex(ccNumber: string): string {
    ccNumber = ccNumber.slice(0, 15);

    const size = ccNumber.length;
    if (size <= 4) {
      ccNumber = ccNumber;
    } else if (size <= 10) {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(4, 10)}`;
    } else {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(
        4,
        10
      )} ${ccNumber.substring(10, 15)}`;
    }
    return ccNumber;
  }

  /**
   * Format the number to '9999 9999 9999 99' for Diners Club
   * @param ccNumber {string}
   */
  private diners(ccNumber: string): string {
    ccNumber = ccNumber.slice(0, 14);

    const size = ccNumber.length;
    if (size <= 4) {
      ccNumber = ccNumber;
    } else if (size <= 8) {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(4, 9)}`;
    } else if (size <= 12) {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(
        4,
        8
      )} ${ccNumber.substring(8, 12)}`;
    } else {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(
        4,
        8
      )} ${ccNumber.substring(8, 12)} ${ccNumber.substring(12, 14)}`;
    }
    return ccNumber;
  }

  /**
   * Format the number to '9999 9999 9999 9999'
   * @param ccNumber {string}
   */
  private unspecific(ccNumber: string): string {
    ccNumber = ccNumber.slice(0, 16);

    const size = ccNumber.length;
    if (size <= 4) {
      ccNumber = ccNumber;
    } else if (size <= 8) {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(4, 9)}`;
    } else if (size <= 12) {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(
        4,
        8
      )} ${ccNumber.substring(8, 12)}`;
    } else {
      ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(
        4,
        8
      )} ${ccNumber.substring(8, 12)} ${ccNumber.substring(12, 16)}`;
    }
    return ccNumber;
  }
}
