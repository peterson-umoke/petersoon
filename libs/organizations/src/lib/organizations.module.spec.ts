import { TestBed, waitForAsync } from '@angular/core/testing';
import { OrganizationsModule } from './organizations.module';

describe('OrganizationsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [OrganizationsModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(OrganizationsModule).toBeDefined();
  });
});
