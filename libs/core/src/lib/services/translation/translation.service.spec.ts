import { inject, TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Environment } from '../../models';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: DateAdapter, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [TranslationService],
    (service: TranslationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
