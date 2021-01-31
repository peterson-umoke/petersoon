import { TestBed } from '@angular/core/testing';
import { OrganizationService, UserService } from '..';
import { GeoLocationService } from '../geo-location/geo-location.service';

describe('GeoLocationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: OrganizationService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    })
  );

  it('should be created', () => {
    const service: GeoLocationService = TestBed.inject(GeoLocationService);
    expect(service).toBeTruthy();
  });
});
