import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AdApiService, CampaignsService } from '@marketplace/core';
import { EMPTY } from 'rxjs';
import { CampaignConversionService } from './campaign-conversion/campaign-conversion.service';
import { CampaignWizardService } from './campaign-wizard.service';

describe('CampaignWizardService', () => {
  let service: CampaignWizardService;
  beforeEach(() => {
    service = new CampaignWizardService(
      new FormBuilder(),
      <CampaignConversionService>{},
      <CampaignsService>{},
      <Router>(<unknown>{ events: EMPTY }),
      <AdApiService>{}
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
