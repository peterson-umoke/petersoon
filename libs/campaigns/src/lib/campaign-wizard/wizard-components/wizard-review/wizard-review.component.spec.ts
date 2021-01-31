import { AgmFitBounds, AgmMap, AgmMarker } from '@agm/core';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CreditCardComponent,
  Environment,
  MaterialModule,
  UserService,
} from '@marketplace/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockDirective, MockPipe } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignCompletionService } from '../../../services/campaign-wizard/campaign-completion/campaign-completion.service';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import { WizardLocationsService } from '../../../services/campaign-wizard/wizard-locations/wizard-locations.service';
import { WizardReviewComponent } from './wizard-review.component';

describe('WizardReviewComponent', () => {
  let component: WizardReviewComponent;
  let fixture: ComponentFixture<WizardReviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardReviewComponent,
          MockComponents(CreditCardComponent, AgmMap, AgmMarker),
          MockDirective(AgmFitBounds),
          MockPipe(TranslatePipe),
          MockPipe(DatePipe),
        ],
        imports: [
          MaterialModule,
          ReactiveFormsModule,
          FlexModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          BrowserAnimationsModule,
        ],
        providers: [
          {
            provide: CampaignWizardService,
            useValue: {
              selectedSigns: [],
              selectedAds$: EMPTY,
              firstShown: () => {},
              campaignForm: new FormGroup({
                name: new FormControl(''),
                budget: new FormControl(null),
                startDate: new FormControl(null),
                endDate: new FormControl(null),
              }),
              scheduleSet: {},
              routes: {},
            },
          },
          {
            provide: WizardLocationsService,
            useValue: {
              selectedClusters: [],
            },
          },
          {
            provide: UserService,
            useValue: {
              $selectedOrgBillable: EMPTY,
            },
          },
          {
            provide: TranslateService,
            useValue: {},
          },
          {
            provide: Environment,
            useValue: {},
          },
          {
            provide: CampaignCompletionService,
            useValue: {
              nameSet$: EMPTY,
              locationsSet$: EMPTY,
              budgetSet$: EMPTY,
              scheduleSet$: EMPTY,
              artworkSet$: EMPTY,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
