import { AdsService } from '@marketplace/core';
import { EMPTY } from 'rxjs';
import { CampaignWizardService } from '../campaign-wizard.service';
import { WizardImageSizesService } from './wizard-image-sizes.service';

describe('WizardImageSizesService', () => {
  let service: WizardImageSizesService;
  beforeEach(() => {
    service = new WizardImageSizesService(
      <AdsService>(<unknown>{
        adDetail$: EMPTY,
      }),
      <CampaignWizardService>(<unknown>{
        selectedSigns$: EMPTY,
      })
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
