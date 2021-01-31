import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { CampaignCompletionService } from './campaign-completion.service';

describe('CampaignCompletionService', () => {
  let service: CampaignCompletionService;
  beforeEach(() => {
    service = new CampaignCompletionService(
      <any>{
        signs$: EMPTY,
        campaignForm: new FormGroup({
          budget: new FormControl(null),
          name: new FormControl(null),
        }),
        selectedAds$: EMPTY,
        schedule$: EMPTY,
        minBudget$: EMPTY,
      },
      <any>{
        $selectedOrgBillable: EMPTY,
      }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
