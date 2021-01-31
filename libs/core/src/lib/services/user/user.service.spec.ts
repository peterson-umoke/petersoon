import { inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { LoadingService, SnackBarService, TranslationService } from '..';
import { OrganizationApiService, ProfileApiService } from '../../api';
import { HTTPService } from '../../api/http/http.service';
import { Environment } from '../../models';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: HTTPService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: OrganizationApiService, useValue: {} },
        { provide: ProfileApiService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        {
          provide: TranslationService,
          useValue: { getTranslation: () => EMPTY },
        },
        { provide: Environment, useValue: {} },
      ],
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
