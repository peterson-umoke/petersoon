import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SnackBarService, TranslationService } from '../../services';
import { HTTPService } from './http.service';

describe('HTTPService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HTTPService,
        { provide: HttpClient, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
      ],
    });
  });

  it('should be created', inject([HTTPService], (service: HTTPService) => {
    expect(service).toBeTruthy();
  }));
});
