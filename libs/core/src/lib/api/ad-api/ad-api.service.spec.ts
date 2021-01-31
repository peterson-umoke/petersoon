import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FIREBASE_CONFIG } from '../../../mocks/firebase.config';
import { BLIP_CONFIG } from '../../core.config';
import { AdApiService } from './ad-api.service';

describe('AdApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: BLIP_CONFIG, useValue: { API_URL: '', FIREBASE_CONFIG } },
      ],
      imports: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: AdApiService = TestBed.inject(AdApiService);
    expect(service).toBeTruthy();
  });
});
