import { TestBed, waitForAsync } from '@angular/core/testing';
import { CardsModule } from './cards.module';

describe('CardsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CardsModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CardsModule).toBeDefined();
  });
});
