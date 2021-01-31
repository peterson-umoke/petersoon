import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ArtworkGeneratorService } from '@marketplace/ads';
import {
  AdsService,
  BingMapsService,
  CampaignApiService,
  MaterialModule,
  SignApiService,
  UserService,
} from '@marketplace/core';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import * as _ from 'lodash';
import { MockPipe } from 'ng-mocks';
import { EMPTY, from, of } from 'rxjs';
import { CampaignCompletionService } from '../services/campaign-wizard/campaign-completion/campaign-completion.service';
import { CampaignInitializationService } from '../services/campaign-wizard/campaign-initialization/campaign-initialization.service';
import { CampaignWizardService } from '../services/campaign-wizard/campaign-wizard.service';
import { WizardImageSizesService } from '../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';
import { WizardLocationsService } from '../services/campaign-wizard/wizard-locations/wizard-locations.service';
import { WizardScheduleService } from '../services/campaign-wizard/wizard-schedule/wizard-schedule.service';
import { CampaignWizardComponent } from './campaign-wizard.component';

describe('CampaignWizardComponent', () => {
  let component: CampaignWizardComponent;
  let fixture: ComponentFixture<CampaignWizardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CampaignWizardComponent, MockPipe(TranslatePipe)],
        imports: [
          FlexModule,
          MaterialModule,
          RouterTestingModule,
          MatDatepickerModule,
          MatNativeDateModule,
          BrowserAnimationsModule,
          TranslateModule,
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ campaignId: 'abc' }),
              queryParamMap: EMPTY,
            },
          },
          {
            provide: SignApiService,
            useValue: {
              geoQuery: () => from([]),
            },
          },
          {
            provide: CampaignApiService,
            useValue: {
              get: of({ id: 'abc' }),
            },
          },
          {
            provide: UserService,
            useValue: {
              $selectedOrganization: of({ id: 'orgid' }),
            },
          },
          {
            provide: AdsService,
            useValue: {
              getAds: () => {},
            },
          },
          {
            provide: TranslateService,
            useValue: {
              get: _.identity,
            },
          },
        ],
      })
        .overrideComponent(CampaignWizardComponent, {
          set: {
            providers: [
              {
                provide: CampaignWizardService,
                useValue: {
                  campaignForm: new FormGroup({
                    budget: new FormControl(null),
                  }),
                  initialize: () => {},
                  selectedSigns$: EMPTY,
                  selectedAds$: EMPTY,
                  saveClose: () => {},
                  saveContinue: () => {},
                  saveCampaign: () => {},
                  unsavedChanged: false,
                  exitWizard: false,
                  campaignEnabled$: EMPTY,
                  url$: EMPTY,
                },
              },
              {
                provide: WizardLocationsService,
                useValue: {},
              },
              {
                provide: WizardScheduleService,
                useValue: {},
              },
              {
                provide: WizardImageSizesService,
                useValue: {},
              },
              {
                provide: BingMapsService,
                useValue: {},
              },
              {
                provide: ArtworkGeneratorService,
                useValue: {},
              },
              {
                provide: CampaignCompletionService,
                useValue: {
                  budgetSet$: EMPTY,
                  locationsSet$: EMPTY,
                  artworkSet$: EMPTY,
                  scheduleSet$: EMPTY,
                  nameSet$: EMPTY,
                  canRequestApproval$: EMPTY,
                },
              },
              {
                provide: CampaignInitializationService,
                useValue: {
                  initialize: async () => {},
                },
              },
            ],
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
