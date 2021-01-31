import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AdsService,
  MaterialModule,
  SnackBarService,
  TranslationService,
  UploadService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { AdsDetailComponent } from './ads-detail.component';

describe('AdsDetailComponent', () => {
  let component: AdsDetailComponent;
  let fixture: ComponentFixture<AdsDetailComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        FormsModule,
      ],
      declarations: [AdsDetailComponent],
      providers: [
        { provide: AdsService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
        { provide: UploadService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
