import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MaterialModule,
  UserService,
  VerificationsService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [HeaderComponent, MockComponents(HeaderMenuComponent)],
      providers: [
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
        { provide: VerificationsService, useValue: { $verifications: EMPTY } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
