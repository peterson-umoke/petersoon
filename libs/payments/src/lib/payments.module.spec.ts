import { TestBed, waitForAsync } from '@angular/core/testing';
import { PaymentsModule } from './payments.module';

xdescribe('PaymentsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PaymentsModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(PaymentsModule).toBeDefined();
  });
});
