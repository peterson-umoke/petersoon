import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  constructor() {}

  /**
   * Track various marketing platforms registration completion
   */
  public registrationCompleted() {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-867817258/ChjQCInW3pYBEKqu550D',
      });
    }
    if ((window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration');
    }
    if ((window as any).qp) {
      (window as any).qp('track', 'Generic');
    }
    if ((window as any).pintrk) {
      (window as any).pintrk('track', 'signup');
    }
  }
}
