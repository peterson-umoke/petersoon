import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConversionService,
  FirestoreService,
  LoadingService,
  SnackBarService,
  TranslationService,
} from '..';
import { Environment } from '../../models';
import { AuthService as BlipAuthService } from '../../services_lib';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireFunctions, useValue: {} },
        { provide: BlipAuthService, useValue: {} },
        { provide: ConversionService, useValue: {} },
        { provide: FirestoreService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    })
  );

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });
});
