import { TestBed } from '@angular/core/testing';
import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConversionService = TestBed.inject(ConversionService);
    expect(service).toBeTruthy();
  });
});
