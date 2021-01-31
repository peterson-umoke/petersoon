import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  CampaignApiService,
  LoadingService,
  MaterialModule,
  ReportsApiService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import * as _ from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { CampaignSpendComponent } from './campaign-spend.component';

describe('CampaignSpendComponent', () => {
  let component: CampaignSpendComponent;
  let fixture: ComponentFixture<CampaignSpendComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      declarations: [CampaignSpendComponent],
      providers: [
        { provide: CampaignApiService, useValue: { list: () => of([]) } },
        { provide: LoadingService, useValue: { setLoading: _.noop } },
        { provide: ReportsApiService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSpendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
