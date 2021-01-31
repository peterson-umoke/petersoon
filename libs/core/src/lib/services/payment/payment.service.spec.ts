import { inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { PaymentApiService } from '../../api';
import {
  LoadingService,
  PaymentService,
  SnackBarService,
  TranslationService,
  UserService,
} from '../../services';

describe('PaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            organization: { id: '' },
          },
        },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
        { provide: LoadingService, useValue: {} },
        { provide: PaymentApiService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [PaymentService],
    (service: PaymentService) => {
      expect(service).toBeTruthy();
    }
  ));
});
