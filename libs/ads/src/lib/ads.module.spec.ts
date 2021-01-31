import { TestBed, waitForAsync } from '@angular/core/testing';
import { CoreModule } from '@marketplace/core';
import { AdsModule } from './ads.module';

describe('AdsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AdsModule, CoreModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(AdsModule).toBeDefined();
  });
});
