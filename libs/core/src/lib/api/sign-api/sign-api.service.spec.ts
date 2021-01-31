import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FIREBASE_CONFIG } from '../../../mocks/firebase.config';
import { BLIP_CONFIG } from '../../core.config';
import { SignApiService } from './sign-api.service';

describe('SignApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: BLIP_CONFIG, useValue: { API_URL: '', FIREBASE_CONFIG } },
      ],
      imports: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: SignApiService = TestBed.inject(SignApiService);
    expect(service).toBeTruthy();
  });
});
