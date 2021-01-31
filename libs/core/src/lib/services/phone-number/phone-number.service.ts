import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhoneNumberService {
  constructor() {}

  /**
   * Takes a string and formats it into a phone number formatted in (801) 692 - 3217
   * @param phone_number {string} - The phone number to be formatted
   */
  public formatPhoneNumber(phone_number: string): string {
    phone_number = this.removeCharacters(phone_number);

    // Trim the remaining phone_number to ten characters, to preserve phone number format
    phone_number = phone_number.substring(0, 10);

    // Based upon the length of the string, we add formatting as necessary
    const size = phone_number.length;
    if (size === 0) {
      phone_number = phone_number;
    } else if (size < 4) {
      phone_number = `(${phone_number}`;
    } else if (size < 7) {
      phone_number = `(${phone_number.substring(
        0,
        3
      )}) ${phone_number.substring(3, 6)}`;
    } else {
      phone_number = `(${phone_number.substring(
        0,
        3
      )}) ${phone_number.substring(3, 6)} - ${phone_number.substring(6, 10)}`;
    }

    return phone_number;
  }

  /**
   * Takes a phone number string and removes everything but the digits
   * @param phone_number {string} - The phone number to be cleaned
   */
  public cleanPhoneNumber(phone_number: string): string {
    return this.removeCharacters(phone_number);
  }

  /**
   * Strip all characters from the phone_number except digits
   * @param phone_number {string}
   */
  private removeCharacters(phone_number: string): string {
    if (phone_number && phone_number.length) {
      return phone_number.replace(/\D/g, '');
    }
  }
}
