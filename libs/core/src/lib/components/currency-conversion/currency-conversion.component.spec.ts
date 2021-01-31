import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CurrencyService,
  MaterialModule,
  PaymentService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { CurrencyConversionComponent } from './currency-conversion.component';

describe('CurrencyConversionComponent', () => {
  let component: CurrencyConversionComponent;
  let fixture: ComponentFixture<CurrencyConversionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [CurrencyConversionComponent],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            foreignExchangeRate: () => ({ rates: { MXN: 19.1491977 } }),
          },
        },
        { provide: CurrencyService, useValue: { toNumber: (val) => val } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConversionComponent);
    component = fixture.componentInstance;
    component.currencyCode = 'MXN';
    component.dollarAmount = '20';
    fixture.detectChanges();
  });

  it('should calculate exchange rate correctly', async () => {
    const preDefinedExchangeRate = 19.1491977;
    component.ngOnInit();
    await fixture.whenStable();
    expect(component['rates']['MXN']).toBe(preDefinedExchangeRate);
    expect(component.convertedRate).toBe(20 * preDefinedExchangeRate);

    component.dollarAmount = '5';
    fixture.detectChanges();
    component.ngOnInit();
    await fixture.whenStable();
    expect(component.convertedRate).toBe(5 * preDefinedExchangeRate);
  });

  it('should calculate exchange rate correctly for currency that is changed', async () => {
    const exchangeRate = 5;
    component.currencyCode = 'EUR';
    component.dollarAmount = '41.85';

    const paymentApiService = TestBed.inject(PaymentService);
    spyOn(paymentApiService, 'foreignExchangeRate').and.returnValue(<any>{
      rates: { EUR: exchangeRate },
    });

    fixture.detectChanges();
    component.ngOnInit();
    await fixture.whenStable();
    expect(paymentApiService.foreignExchangeRate).toHaveBeenCalled();
    expect(component['rates']['EUR']).toBe(exchangeRate);
    expect(component.convertedRate).toBe(41.85 * exchangeRate);

    component.dollarAmount = '20.55';
    fixture.detectChanges();
    component.ngOnInit();
    await fixture.whenStable();
    expect(component.convertedRate).toBe(20.55 * exchangeRate);
  });
});
