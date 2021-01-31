import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthAPIService } from '../../api/auth/auth-api.service';
import { HasTokenGuard } from './has-token.guard';

describe('HasTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HasTokenGuard,
        { provide: AuthAPIService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
    });
  });

  it('should ...', inject([HasTokenGuard], (guard: HasTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
