import { TestBed, waitForAsync } from '@angular/core/testing';
import { CampaignsModule } from './campaigns.module';

describe('CampaignsContainerModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CampaignsModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CampaignsModule).toBeDefined();
  });
});
