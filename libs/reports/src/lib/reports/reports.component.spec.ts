import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  LoadingService,
  MaterialModule,
  ReportsApiService,
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { CampaignSpendComponent } from '../campaign-spend/campaign-spend.component';
import { InvoiceComponent } from '../invoice/invoice.component';
import { PopComponent } from '../pop/pop.component';
import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportsComponent,
        MockComponents(CampaignSpendComponent, InvoiceComponent, PopComponent),
      ],
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: LoadingService, useValue: {} },
        { provide: ReportsApiService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
        {
          provide: UserService,
          useValue: { $selectedOrganization: EMPTY, $profile: EMPTY },
        },
        { provide: AngularFirestore, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
