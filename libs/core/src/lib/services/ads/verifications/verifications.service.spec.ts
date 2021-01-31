import { inject, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { LoadingService, UserService } from '../..';
import { AdApiService } from '../../../api';
import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VerificationsService,
        { provide: AdApiService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: UserService, useValue: { $selectedOrganization: EMPTY } },
      ],
    });
  });

  it('should be created', inject(
    [VerificationsService],
    (service: VerificationsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
