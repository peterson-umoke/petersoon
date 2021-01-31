import { inject, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { RouterService, TranslationService } from '..';
import { TitleService } from './title.service';

describe('TitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Meta, useValue: {} },
        { provide: RouterService, useValue: {} },
        { provide: Title, useValue: {} },
        { provide: TranslationService, useValue: {} },
      ],
    });
  });

  it('should be created', inject([TitleService], (service: TitleService) => {
    expect(service).toBeTruthy();
  }));
});
