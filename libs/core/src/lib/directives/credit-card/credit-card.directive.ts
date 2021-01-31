import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CreditCardService } from '../../services';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appCreditCard]',
})
export class CreditCardDirective implements OnInit {
  @Input() form: AbstractControl;
  @Input() input: 'month' | 'number' = 'number';
  @Output() cardType: EventEmitter<string> = new EventEmitter();

  constructor(private ccService: CreditCardService) {}

  ngOnInit() {
    this.form.valueChanges.subscribe((value: string) => {
      if (value) {
        if (this.input === 'number') {
          const obj = this.ccService.formatCreditCardNumber(value);
          this.cardType.emit(obj.type);
          if (obj.number !== this.form.value) {
            this.form.setValue(obj.number);
          }
        } else {
          const obj = this.ccService.formatMonthYear(value);
          if (obj !== this.form.value) {
            this.form.setValue(obj);
          }
        }
      }
    });
  }
}
