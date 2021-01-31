import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CurrencyConversionComponent,
  CurrencyDirective,
  MaterialModule,
  UserService,
} from '@marketplace/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import { WizardBudgetComponent } from './wizard-budget.component';

describe('WizardBudgetComponent', () => {
  let component: WizardBudgetComponent;
  let fixture: ComponentFixture<WizardBudgetComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardBudgetComponent,
          MockComponent(CurrencyConversionComponent),
          MockDirective(CurrencyDirective),
          MockPipe(TranslatePipe),
        ],
        imports: [
          MaterialModule,
          MatNativeDateModule,
          MatDatepickerModule,
          ReactiveFormsModule,
          FormsModule,
          BrowserAnimationsModule,
        ],
        providers: [
          {
            provide: CampaignWizardService,
            useValue: {
              campaignForm: new FormGroup({
                budget: new FormControl(null),
                startDate: new FormControl(null),
                endDate: new FormControl(null),
              }),
              selectedSigns: [],
              minBudget: 0,
              maxBudget: 0,
              setRecommendedBudget: () => {},
            },
          },
          {
            provide: UserService,
            useValue: {
              $profile: EMPTY,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
