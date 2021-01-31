import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { PhoneNumberService } from '../../services';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appPhoneNumber]',
})
export class PhoneNumberDirective implements OnInit {
  @Input() formControl: AbstractControl;

  constructor(private phoneNumberService: PhoneNumberService) {}

  ngOnInit() {
    if (this.formControl.value) {
      const number = this.phoneNumberService.formatPhoneNumber(
        this.formControl.value
      );
      this.formControl.setValue(number);
    }

    this.formControl.valueChanges.subscribe((value: string) => {
      if (value) {
        const number = this.phoneNumberService.formatPhoneNumber(value);
        if (number !== this.formControl.value) {
          this.formControl.setValue(number);
        }
      }
    });
  }
}
