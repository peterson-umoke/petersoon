import { inject, TestBed } from '@angular/core/testing';
import { LoadingService, UserService } from '..';
import { OrganizationApiService } from '../../api';
import { OrganizationService } from './organization.service';

describe('OrganizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: {} },
        { provide: OrganizationApiService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [OrganizationService],
    (service: OrganizationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
