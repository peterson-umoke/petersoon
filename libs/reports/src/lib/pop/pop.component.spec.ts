import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  AdApiService,
  LoadingService,
  MaterialModule,
  ReportsApiService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import * as _ from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { PopComponent } from './pop.component';

describe('PopComponent', () => {
  let component: PopComponent;
  let fixture: ComponentFixture<PopComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      declarations: [PopComponent],
      providers: [
        { provide: AdApiService, useValue: { getPopReportAds: () => EMPTY } },
        { provide: LoadingService, useValue: { setLoading: _.noop } },
        { provide: ReportsApiService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
