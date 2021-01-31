import { TestBed, waitForAsync } from '@angular/core/testing';
import { FIREBASE_CONFIG } from '../mocks/firebase.config';
import { BLIP_CONFIG } from './core.config';
import { CoreModule } from './core.module';

describe('CoreModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: BLIP_CONFIG, useValue: { API_URL: '', FIREBASE_CONFIG } },
        ],
        imports: [CoreModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CoreModule).toBeDefined();
  });
});
