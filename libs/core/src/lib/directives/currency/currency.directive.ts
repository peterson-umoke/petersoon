import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { CurrencyService } from '../../services';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appCurrency]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyDirective),
      multi: true,
    },
  ],
})
export class CurrencyDirective implements OnChanges, ControlValueAccessor {
  @Input() commas = true;
  @Input() maxDigits = 9;

  private onChange = _.noop;
  private onTouched = _.noop;
  private amount: number;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private currencyService: CurrencyService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.unit && this.amount) {
      this.writeValue(this.amount);
    }
  }
  @HostListener('input', ['$event.target.value'])
  input(value: string) {
    const newAmount = this.parse(value);
    this.onChange((this.amount = _.isNaN(newAmount) ? undefined : newAmount));
  }
  @HostListener('blur')
  blur() {
    // Reformat if needed
    this.writeValue(this.amount);
    this.onTouched();
  }
  writeValue(amount: number): void {
    this.amount = amount;
    const element = this.element.nativeElement;
    this.renderer.setProperty(element, 'value', this.format(amount || 0));
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private format(value: number): string {
    return this.currencyService.format(value.toString() || '0', {
      maxDigits: this.maxDigits,
      commas: this.commas,
    });
  }

  private parse(value: string): number {
    return this.currencyService.toNumber(value);
  }
}
