import { Directive, ElementRef } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';

/**
 * If a page is loaded with appearance="outline" inputs, the gap for
 * floating labels is off. This directive updates the gap and properly
 * displays the floating labels after ran.
 *
 * If a page is navigated to, the gap works fine.
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appUpdateOutlineGap]',
})
export class UpdateOutlineGapDirective {
  constructor(private field: MatFormField) {
    setTimeout(() => {
      field.updateOutlineGap();
    });
  }
}
