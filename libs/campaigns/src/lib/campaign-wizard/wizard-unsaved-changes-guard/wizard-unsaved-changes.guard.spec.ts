import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@marketplace/core';
import { WizardUnsavedChangesGuard } from './wizard-unsaved-changes.guard';

describe('WizardUnsavedChangesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WizardUnsavedChangesGuard],
      imports: [MaterialModule, RouterTestingModule],
    });
  });

  it('should ...', inject(
    [WizardUnsavedChangesGuard],
    (guard: WizardUnsavedChangesGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
