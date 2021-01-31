import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthAPIService,
  AuthServiceLib,
  GoogleAnalyticsDirective,
  MaterialModule,
  SnackBarService,
  TranslationService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { RegisterSuccessComponent } from './register-success.component';

describe('RegisterSuccessComponent', () => {
  let component: RegisterSuccessComponent;
  let fixture: ComponentFixture<RegisterSuccessComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        RegisterSuccessComponent,
        MockDirective(GoogleAnalyticsDirective),
      ],
      providers: [
        { provide: AuthAPIService, useValue: {} },
        {
          provide: AuthServiceLib,
          useValue: { loggedIn: () => of(true).toPromise() },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
