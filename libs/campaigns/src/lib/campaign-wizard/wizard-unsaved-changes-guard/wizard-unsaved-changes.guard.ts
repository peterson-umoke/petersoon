import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SaveChangesComponent } from '@marketplace/core';
import { CampaignWizardComponent } from '../campaign-wizard.component';

@Injectable({ providedIn: 'root' })
export class WizardUnsavedChangesGuard
  implements CanDeactivate<CampaignWizardComponent> {
  constructor(private dialog: MatDialog, private router: Router) {}

  public canDeactivate(
    campaignWizardComponent: CampaignWizardComponent,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean {
    if (
      !campaignWizardComponent.exitWizard &&
      campaignWizardComponent.unsavedChanges()
    ) {
      campaignWizardComponent.exitWizard = true;
      const dialogRef = this.dialog.open(SaveChangesComponent);
      dialogRef.afterClosed().subscribe((save: boolean) => {
        if (save) {
          campaignWizardComponent.saveCampaign().then(() => {
            this.router.navigateByUrl(nextState.url);
            return true;
          });
        } else {
          this.router.navigateByUrl(nextState.url);
          return true;
        }
      });
    } else {
      return true;
    }
  }
}
