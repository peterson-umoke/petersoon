import { ActivatedRoute } from '@angular/router';
import {
  AdsService,
  CampaignApiService,
  SignApiService,
  UserService,
} from '@marketplace/core';
import { CampaignWizardService } from '../campaign-wizard.service';
import { CampaignInitializationService } from './campaign-initialization.service';

describe('CampaignInitializationService', () => {
  let service: CampaignInitializationService;
  beforeEach(() => {
    service = new CampaignInitializationService(
      <UserService>{},
      <ActivatedRoute>{},
      <SignApiService>{},
      <CampaignApiService>{},
      <AdsService>{},
      <CampaignWizardService>{}
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
