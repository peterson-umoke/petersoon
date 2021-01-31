import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDialogComponent,
  MaterialModule,
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { NewUserComponent } from './new-user.component';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewUserComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        FlexLayoutModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: new BehaviorSubject({}) },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => {
              return { afterClosed: () => new BehaviorSubject('') };
            },
          },
        },
        { provide: Location, useValue: { back: () => {} } },
        { provide: SnackBarService, useValue: { openTranslation: () => {} } },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
        {
          provide: UserService,
          useValue: {
            $selectedOrganization: of({ id: 'o1' }),
            $profile: EMPTY,
            addUserToOrg: () => Promise.resolve(),
            deleteUserFromOrg: () => Promise.resolve(),
            getUserFromOrg: () => Promise.resolve({ result: { id: 'u1' } }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
  });

  it('should navigate to users', () => {
    fixture.detectChanges();
    const location = TestBed.inject(Location);
    spyOn(location, 'back').and.callFake(() => {
      expect(location.back).toHaveBeenCalled();
    });
    component.goBack();
  });

  it('should not add a new user to org because form is invalid', async () => {
    fixture.detectChanges();
    expect(component.submitted).toBeFalsy();
    expect(component.newUserForm.invalid).toBeTruthy();
    const translationService = fixture.debugElement.injector.get(
      TranslationService
    );
    const translation = 'Political organizations need prepay money';
    spyOn(translationService, 'getTranslation').and.callFake(
      (key: string) => new BehaviorSubject(translation)
    );
    await fixture.whenStable();

    fixture.debugElement
      .query(By.css('button[data-test=save-button]'))
      .nativeElement.click();
    expect(component.submitted).toBeTruthy();
    expect(component.newUserForm.invalid).toBeTruthy();
  });

  it('should add a new user to org', async () => {
    fixture.detectChanges();
    expect(component.submitted).toBeFalsy();
    expect(component.newUserForm.invalid).toBeTruthy();

    component.newUserForm.setValue({
      first_name: 'test',
      last_name: 'user',
      email: 'test_user@gmail.com',
      roles: 'ADMIN',
    });
    const userService = TestBed.inject(UserService);
    spyOn(userService, 'addUserToOrg').and.returnValue(Promise.resolve());
    const openTranslation = spyOn(
      TestBed.inject(SnackBarService),
      'openTranslation'
    );

    await component.addorUpdateUser();
    expect(component.submitted).toBeTruthy();
    expect(component.newUserForm.invalid).toBeFalsy();
    expect(openTranslation).toHaveBeenCalledWith('SUCCESS.UPDATING', {
      key: 'type',
      translation: 'ORGANIZATION.TEXT',
    });
  });

  it('should reject when adding new user to org', async () => {
    fixture.detectChanges();
    expect(component.submitted).toBeFalsy();
    expect(component.newUserForm.invalid).toBeTruthy();

    component.newUserForm.setValue({
      first_name: 'test',
      last_name: 'user',
      email: 'test_user@gmail.com',
      roles: 'ADMIN',
    });
    const userService = TestBed.inject(UserService);
    spyOn(userService, 'addUserToOrg').and.returnValue(
      Promise.reject('Test error')
    );
    const openTranslation = spyOn(
      TestBed.inject(SnackBarService),
      'openTranslation'
    );

    await component.addorUpdateUser();
    expect(component.submitted).toBeTruthy();
    expect(component.newUserForm.invalid).toBeFalsy();
    expect(openTranslation).toHaveBeenCalledWith('ERROR.UPDATING', {
      key: 'type',
      translation: 'ORGANIZATION.TEXT',
    });
  });

  it('should select delete user button and open / close dialog ref then call deleteUserFromOrg', async () => {
    (<any>TestBed.inject(ActivatedRoute).params).next({ id: 'u1' });
    fixture.detectChanges();
    const dialog = TestBed.inject(MatDialog);
    const dia = dialog.open(ChangeDialogComponent);
    dia.afterClosed = () => new BehaviorSubject({});

    spyOn(dialog, 'open').and.returnValue(dia);
    component.userId = '3xtest';
    component.canDeleteUser = true;
    fixture.detectChanges();

    await fixture.whenStable();
    const deleteUserFromOrg = spyOn(
      TestBed.inject(UserService),
      'deleteUserFromOrg'
    ).and.returnValue(Promise.resolve({}));
    await component.deleteUserFromOrg();
    expect(dialog.open).toHaveBeenCalled();
    expect(deleteUserFromOrg).toHaveBeenCalledWith('o1', 'u1');
  });
});
