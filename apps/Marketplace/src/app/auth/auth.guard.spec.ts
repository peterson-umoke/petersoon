import { inject, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  AuthAPIService,
  Environment,
  FirestoreService,
  UserService,
} from '@marketplace/core';
import { TranslateService } from '@ngx-translate/core';
import { Intercom } from 'ng-intercom';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthAPIService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: Intercom, useValue: {} },
        { provide: FirestoreService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
