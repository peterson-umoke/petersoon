import { inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { LoadingService, SnackBarService, TranslationService } from '..';
import { CampaignApiService } from '../../api';
import { CampaignService } from './campaign.service';

describe('CampaignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CampaignService,
        { provide: CampaignApiService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
      ],
    });
  });

  it('should be created', inject(
    [CampaignService],
    (service: CampaignService) => {
      expect(service).toBeTruthy();
    }
  ));
});
