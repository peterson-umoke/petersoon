import { TranslateService } from '@ngx-translate/core';
import { WizardScheduleService } from './wizard-schedule.service';

describe('WizardScheduleService', () => {
  let service: WizardScheduleService;
  beforeEach(() => {
    service = new WizardScheduleService(<TranslateService>{});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
