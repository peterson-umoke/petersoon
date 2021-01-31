import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  AppRoutes,
  AuthAPIService,
  Environment,
  FirestoreService,
  Profile,
  TermsAndConditionsComponent,
  UserService,
} from '@marketplace/core';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import firebase from 'firebase';
import * as _ from 'lodash';
import { Intercom } from 'ng-intercom';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const INTERCOM_KEY = 'qBLTAZyku3tBJ1QBbVL5HD_4Yg6S5hGtaSkYmXbS';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authApi: AuthAPIService,
    private dialog: MatDialog,
    private intercom: Intercom,
    private firestoreService: FirestoreService,
    private translationService: TranslateService,
    private userService: UserService,
    private router: Router,
    private environment: Environment
  ) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkCanActivate(next, state);
  }

  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkCanActivate(route, state);
  }

  private async authenticated(
    route: ActivatedRouteSnapshot
  ): Promise<firebase.User> {
    try {
      const user = await this.authApi.checkLogin(route);
      const hmac = CryptoJS.HmacSHA256(user.uid, INTERCOM_KEY).toString();
      this.firestoreService.updateLastLogin(user);
      this.intercom.boot({
        email: user.email,
        name: user.displayName,
        user_id: user.uid,
        language_override:
          this.translationService.currentLang || this.environment.LOCALE_ID,
        user_hash: hmac,
      });
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async checkCanActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.authenticated(route)
        .then((user: firebase.User) => {
          if (!user.emailVerified) {
            // If email hasn't been verified, go to register success page to resend email if needed
            this.router.navigate([AppRoutes.CREATE_ORGANIZATION], {
              queryParams: { returnUrl: state.url },
            });
            resolve(false);
          } else {
            const subject = new Subject();
            this.userService.$profile
              .pipe(takeUntil(subject))
              .subscribe((profile: Profile) => {
                if (profile) {
                  subject.next();
                  subject.complete();

                  if (
                    !profile.organizations.length &&
                    !_.startsWith(state.url, AppRoutes.CREATE_ORGANIZATION)
                  ) {
                    // If user has no associated organizations, go to create organization page
                    this.router.navigate([AppRoutes.CREATE_ORGANIZATION], {
                      queryParams: {
                        returnUrl: AppRoutes.NEW_CAMPAIGN_LOCATIONS,
                      },
                    });

                    resolve(false);
                    return;
                  }

                  if (
                    !profile.user.terms_accepted &&
                    !state.url.includes('check-campaigns')
                  ) {
                    const confirmDialog = this.dialog.open(
                      TermsAndConditionsComponent,
                      {
                        minWidth: '50vw',
                        maxWidth: '60vw',
                        disableClose: true,
                        data: {
                          acceptTerms: true,
                        },
                      }
                    );

                    confirmDialog
                      .afterClosed()
                      .subscribe((confirmed: boolean) => {
                        if (confirmed) {
                          this.userService
                            .terms()
                            .then(() => {
                              resolve(true);
                            })
                            .catch(() => {});
                        } else {
                          resolve(false);
                        }
                      });
                    return;
                  }
                  resolve(true);
                }
              });
          }
        })
        .catch(() => {
          // If no logged in user, redirect to login
          this.router.navigate([AppRoutes.LOGIN], {
            queryParams: { returnUrl: state.url },
          });
          resolve(false);
        });
    });
  }
}
