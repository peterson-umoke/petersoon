import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { HasCampaignsGuard } from './has-campaigns.guard';

describe('HasCampaignsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HasCampaignsGuard,
        { provide: UserService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
    });
  });

  it('should ...', inject([HasCampaignsGuard], (guard: HasCampaignsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
