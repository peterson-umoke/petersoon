import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FIREBASE_CONFIG } from '../../../mocks/firebase.config';
import { BLIP_CONFIG } from '../../core.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: BLIP_CONFIG, useValue: { API_URL: '', FIREBASE_CONFIG } },
        { provide: FIREBASE_OPTIONS, useValue: FIREBASE_CONFIG },
        { provide: FIREBASE_APP_NAME, useValue: 'BlipCore' },
      ],
      imports: [AngularFireAuthModule, HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });
});
