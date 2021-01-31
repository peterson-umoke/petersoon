import { inject, TestBed } from '@angular/core/testing';
import { SignApiService } from '../../api';
import { SignService } from './sign.service';

describe('SignsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SignApiService, useValue: {} }],
    });
  });

  it('should be created', inject([SignService], (service: SignService) => {
    expect(service).toBeTruthy();
  }));
});
