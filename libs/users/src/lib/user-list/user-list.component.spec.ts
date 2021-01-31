import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule, UserService } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { EMPTY } from 'rxjs';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: UserService,
          useValue: { $selectedOrganization: EMPTY, $profile: EMPTY },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should navigate to edit user page', () => {
    const user = {
      first_name: 'test',
      last_name: 'user',
      email: 'test@gmail.com',
      roles: ['ADMIN', 'ANALYST'],
      id: 'test23',
    };
    spyOn(router, 'navigateByUrl');
    component.edit(user);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/users/test23');
  });
});
