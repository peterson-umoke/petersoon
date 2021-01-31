import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthService,
  GoogleAnalyticsDirective,
  LoadingService,
  MaterialModule,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import * as _ from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [LoginComponent, MockDirective(GoogleAnalyticsDirective)],
      providers: [
        { provide: AuthService, useValue: { initialize: _.noop } },
        { provide: LoadingService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
