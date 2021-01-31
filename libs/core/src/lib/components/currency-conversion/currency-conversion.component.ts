import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ExchangeCurrencyCode } from '../../api';
import { CurrencyService, PaymentService } from '../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-currency-conversion',
  templateUrl: './currency-conversion.component.html',
  styleUrls: ['./currency-conversion.component.scss'],
})
export class CurrencyConversionComponent implements OnInit, OnChanges {
  @Input() currencyCode: ExchangeCurrencyCode;
  @Input() dollarAmount: string;

  public convertedRate: number;

  private rates = {};

  constructor(
    private currencyService: CurrencyService,
    private paymentService: PaymentService
  ) {}

  async ngOnInit() {
    try {
      const result = await this.paymentService.foreignExchangeRate(
        this.currencyCode
      );
      this.rates[this.currencyCode] = result.rates[this.currencyCode];
      this.calculateExchangeRate();
    } catch (error) {
      console.error(error);
    }
  }

  async ngOnChanges() {
    this.calculateExchangeRate();
  }

  private async calculateExchangeRate() {
    const amount = this.currencyService.toNumber(this.dollarAmount);
    this.convertedRate = this.rates[this.currencyCode] * amount;
  }
}
