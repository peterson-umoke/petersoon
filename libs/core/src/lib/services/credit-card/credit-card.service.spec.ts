import { inject, TestBed } from '@angular/core/testing';
import { CreditCardService } from './credit-card.service';

describe('CreditCardService', () => {
  beforeEach(() => {
    window['Spreedly'] = {
      init: () => {},
      on: () => {},
    };
    TestBed.configureTestingModule({
      providers: [CreditCardService],
    });
  });

  it('should be created', inject(
    [CreditCardService],
    (service: CreditCardService) => {
      expect(service).toBeTruthy();
    }
  ));
});
