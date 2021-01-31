import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FIREBASE_CONFIG } from '../../../mocks/firebase.config';
import { BLIP_CONFIG } from '../../core.config';
import { ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: BLIP_CONFIG, useValue: { API_URL: '', FIREBASE_CONFIG } },
      ],
      imports: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: ProfileApiService = TestBed.inject(ProfileApiService);
    expect(service).toBeTruthy();
  });
});
