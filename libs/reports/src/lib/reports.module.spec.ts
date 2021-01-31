import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReportsModule } from './reports.module';

describe('ReportsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReportsModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(ReportsModule).toBeDefined();
  });
});
