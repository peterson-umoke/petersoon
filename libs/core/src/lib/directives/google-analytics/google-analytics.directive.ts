import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appGoogleAnalytics]',
})
export class GoogleAnalyticsDirective {
  @Input() googleCategory: string;
  @Input() googleAction: string;
  @Input() googleLabel: string;
  @Input() googleValue: string;

  constructor() {}

  @HostListener('click', ['$event']) onclick($event) {
    if (!this.googleCategory) {
      console.error("Please provide a 'googleCategory' for event tracking");
      return;
    }
    if (!this.googleAction) {
      console.error("Please provide a 'googleAction' for event tracking");
      return;
    }
    if (!this.googleLabel) {
      console.warn(
        "Optional but recommended 'googleLabel' not provided for event tracking"
      );
    }

    (<any>window).ga('send', 'event', {
      eventCategory: this.googleCategory,
      eventAction: this.googleAction,
      eventLabel: this.googleLabel || null,
      eventValue: this.googleValue || null,
    });
  }
}
