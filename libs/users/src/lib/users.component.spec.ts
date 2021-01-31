import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MaterialModule,
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { NewUserComponent } from './new-user/new-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let router: Router;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        UsersComponent,
        MockComponent(NewUserComponent),
        MockComponent(UserListComponent),
      ],
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        MockModule(FlexLayoutModule),
        MockModule(RouterTestingModule),
      ],
      providers: [
        { provide: AngularFireAuth, useValue: () => {} },
        { provide: AngularFireFunctions, useValue: () => {} },
        { provide: AngularFirestore, useValue: () => {} },
        { provide: DateAdapter, useValue: {} },
        { provide: SnackBarService, useValue: { openTranslation: () => {} } },
        {
          provide: UserService,
          useValue: {
            getUsersFromOrg: () => Promise.resolve(),
            $selectedOrganization: EMPTY,
          },
        },
        {
          provide: TranslationService,
          userValue: { getTranslation: () => EMPTY },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should navigate to new-user', () => {
    component.newUser();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/new']);
  });
});
