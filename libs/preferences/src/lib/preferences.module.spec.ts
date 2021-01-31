import { TestBed, waitForAsync } from '@angular/core/testing';
import { PreferencesModule } from './preferences.module';

describe('PreferencesModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PreferencesModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(PreferencesModule).toBeDefined();
  });
});
