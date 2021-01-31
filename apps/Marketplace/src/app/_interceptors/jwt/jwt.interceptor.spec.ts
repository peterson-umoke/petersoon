import { TestBed } from '@angular/core/testing';
import { AuthServiceLib } from '@marketplace/core';

import { JwtInterceptor } from './jwt.interceptor';

describe('JWTService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [JwtInterceptor, { provide: AuthServiceLib, useValue: {} }],
    })
  );

  it('should be created', () => {
    const service: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(service).toBeTruthy();
  });
});
