import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data?: { acceptTerms?: boolean }
  ) {}
}
