import { inject, TestBed } from '@angular/core/testing';
import { TranslationService } from '..';
import { SnackBarService } from './snack-bar.service';

describe('SnackBarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslationService, useValue: {} }],
    });
  });

  it('should be created', inject(
    [SnackBarService],
    (service: SnackBarService) => {
      expect(service).toBeTruthy();
    }
  ));
});
