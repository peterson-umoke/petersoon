import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import {
  LoadingService,
  SnackBarService,
  TranslationService,
  UserService,
} from '..';
import { CampaignApiService } from '../../api';
import { Environment } from '../../models';
import { CampaignsService } from './campaigns.service';

describe('CampaignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CampaignApiService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
        { provide: Environment, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [CampaignsService],
    (service: CampaignsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
