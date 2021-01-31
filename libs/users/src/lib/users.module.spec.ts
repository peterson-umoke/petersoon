import { TestBed, waitForAsync } from '@angular/core/testing';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UsersModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(UsersModule).toBeDefined();
  });
});
