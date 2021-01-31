import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppRoutes,
  AuthAPIService,
  AuthServiceLib,
  SnackBarService,
  TranslationService,
} from '@marketplace/core';
import firebase from 'firebase';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
})
export class RegisterSuccessComponent {
  public userEmail = '';

  constructor(
    private authApiService: AuthAPIService,
    private authService: AuthServiceLib,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService,
    private translationService: TranslationService
  ) {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    // If they refresh the page after verifying their email,
    // route them to the login page
    this.authService.loggedIn().then((user: firebase.User) => {
      if (user) {
        this.userEmail = user.email;
        if (user.emailVerified) {
          this.router.navigateByUrl(returnUrl);
        }
      }
    });
  }

  /**
   * When a user hasn't received their confirmation email or needs it again
   */
  public resendLink(): void {
    this.authService
      .sendConfirmationEmail(window.location.href)
      .then(() => {
        this.translationService
          .getTranslation('REGISTER_SUCCESS.RESENT', { email: this.userEmail })
          .subscribe((text: string) => {
            this.snackBarService.open(text);
          });
      })
      .catch((err) => {
        this.translationService
          .getTranslation('AUTH.ERROR_SENDING_EMAIL')
          .subscribe((text: string) => {
            this.snackBarService.open(text);
          });
        console.error(`SEND EMAIL ERROR: ${err}`);
      });
  }

  /**
   * For when a user registers with an incorrect email and needs to logout.
   */
  public async logout() {
    this.authApiService.logout().then(() => {
      this.router.navigateByUrl(AppRoutes.LOGIN);
    });
  }
}
