import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthAPIService,
  GoogleAnalyticsDirective,
  MaterialModule,
  UserService,
  VerificationsService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { Intercom } from 'ng-intercom';
import { MockDirective } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { HeaderMenuComponent } from './header-menu.component';

describe('HeaderMenuComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        HeaderMenuComponent,
        MockDirective(GoogleAnalyticsDirective),
      ],
      providers: [
        { provide: AuthAPIService, useValue: {} },
        { provide: Intercom, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UserService, useValue: { $selectedOrgInfo: EMPTY } },
        { provide: VerificationsService, useValue: { $verifications: EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
