import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyDirective, MaterialModule } from '@marketplace/core';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MockDirective, MockPipe } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import { WizardScheduleService } from '../../../services/campaign-wizard/wizard-schedule/wizard-schedule.service';
import { WizardScheduleComponent } from './wizard-schedule.component';

describe('WizardScheduleComponent', () => {
  let component: WizardScheduleComponent;
  let fixture: ComponentFixture<WizardScheduleComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardScheduleComponent,
          MockDirective(CurrencyDirective),
          MockPipe(TranslatePipe),
        ],
        imports: [
          MaterialModule,
          FlexModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
        ],
        providers: [
          {
            provide: CampaignWizardService,
            useValue: {
              campaignForm: new FormGroup({
                mpbLow: new FormControl(null),
                mpbMed: new FormControl(null),
                mpbHigh: new FormControl(null),
              }),
              schedule$: EMPTY,
              uniqueSignCampaign: _.noop,
            },
          },
          {
            provide: WizardScheduleService,
            useValue: {
              selectedPreset$: EMPTY,
              localDays: () => [],
              localHours: () => [],
              presetKeys: [],
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
