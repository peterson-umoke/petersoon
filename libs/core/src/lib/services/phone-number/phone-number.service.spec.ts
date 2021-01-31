import { inject, TestBed } from '@angular/core/testing';
import { PhoneNumberService } from './phone-number.service';

describe('PhoneNumberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhoneNumberService],
    });
  });

  it('should be created', inject(
    [PhoneNumberService],
    (service: PhoneNumberService) => {
      expect(service).toBeTruthy();
    }
  ));
});
