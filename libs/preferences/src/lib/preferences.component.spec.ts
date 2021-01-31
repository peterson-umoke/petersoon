import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Environment,
  MaterialModule,
  PhoneNumberService,
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import * as _ from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { PreferencesComponent } from './preferences.component';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [PreferencesComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: {
            setTranslation: () => {},
          },
        },
        {
          provide: UserService,
          useValue: {
            $profile: new BehaviorSubject({ user: {} }),
            getNotificationPreferences: () => Promise.resolve(),
            updateUserPreferences: () => Promise.resolve(),
          },
        },
        {
          provide: PhoneNumberService,
          useValue: { cleanPhoneNumber: _.identity },
        },
        { provide: SnackBarService, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
