import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Environment } from '../../models';
import { LoadingService } from '../../services';
import { ScraperApiService } from './scraper-api.service';

describe('ScraperApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScraperApiService,
        { provide: HttpClient, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [ScraperApiService],
    (service: ScraperApiService) => {
      expect(service).toBeTruthy();
    }
  ));
});
