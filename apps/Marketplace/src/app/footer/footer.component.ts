import { ComponentType } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Environment,
  TermsAndConditionsComponent,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { PrivacyPolicyDialogComponent } from '../privacy-policy-dialog/privacy-policy-dialog.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public backToOldLink: string;

  constructor(
    private dialog: MatDialog,
    private translationService: TranslationService,
    private userService: UserService,
    private environment: Environment
  ) {
    this.backToOldLink = environment.API_URL;
  }

  public open(type: string): void {
    switch (type) {
      case 'terms':
        this.openDialog(TermsAndConditionsComponent);
        break;
      case 'privacy':
        this.openDialog(PrivacyPolicyDialogComponent);
        break;
      default:
        break;
    }
  }

  private openDialog(component: ComponentType<any>) {
    this.dialog.open(component, {
      minWidth: '50vw',
      maxWidth: '60vw',
    });
  }

  /**
   * Change the apps language
   */
  public translate(language: string) {
    this.translationService.setTranslation(language);
    this.userService.updateUserPreferences({ language });
  }
}
