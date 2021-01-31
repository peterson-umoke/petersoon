import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [
        RegisterComponent,
        MockDirective(GoogleAnalyticsDirective),
      ],
      providers: [
        { provide: AuthService, useValue: { initialize: _.noop } },
        { provide: MatDialog, useValue: {} },
        { provide: LoadingService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
