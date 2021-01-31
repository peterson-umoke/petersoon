import { inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import {
  LoadingService,
  SnackBarService,
  TranslationService,
  UserService,
} from '../..';
import { AdApiService } from '../../../api';
import { AdsService } from './ads.service';

describe('AdsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdsService,
        { provide: AdApiService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
      ],
    });
  });

  it('should be created', inject([AdsService], (service: AdsService) => {
    expect(service).toBeTruthy();
  }));
});
