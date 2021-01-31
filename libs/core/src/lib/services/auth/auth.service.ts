import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { tz } from 'moment-timezone';
import { take } from 'rxjs/operators';
import { AppRoutes } from '../../enums';
import { Environment } from '../../models';
import { AuthService as BlipAuthService } from '../../services_lib';
// Services
import { ConversionService } from '../conversion/conversion.service';
import { FirestoreService } from '../firestore/firestore.service';
import { LoadingService } from '../loading/loading.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { TranslationService } from '../translation/translation.service';

const VERSION = '2.0';

export interface RegisterForm {
  email: string;
  name: string;
  password: string;
  phone?: number;
  timezone: string;
  ui_version?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firstTime = true;
  private returnUrl: string;

  constructor(
    private afFunctions: AngularFireFunctions,
    private blipAuthService: BlipAuthService,
    private conversionService: ConversionService,
    private firestoreService: FirestoreService,
    private http: HttpClient,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private environment: Environment
  ) {}

  public initialize() {
    this.blipAuthService.clearCookies();
    if (this.firstTime) {
      this.firstTime = false;
      this.loadRedirect();
    } else {
      this.isLoggedIn();
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  public enterEmail() {
    this.translationService
      .getTranslation('AUTH.FORGOT_PASSWORD.ENTER_EMAIL')
      .subscribe((text: string) => {
        this.snackBarService.open(text);
      });
  }

  /**
   * Show an error message along with a close button
   * message
   */
  private errorMessage(message: string): void {
    this.snackBarService.open(message, 4000);
  }

  public facebook(): void {
    this.blipAuthService.facebook();
  }

  public forgotPassword(email: string): void {
    this.blipAuthService
      .sendPasswordResetEmail(email, window.location.href)
      .then(() => {
        this.translationService
          .getTranslation('AUTH.FORGOT_PASSWORD.EMAIL_SENT')
          .subscribe((text: string) => {
            this.snackBarService.open(text);
          });
      })
      .catch((err) => {
        const translation = this.blipAuthService.errors(err);
        this.translationService
          .getTranslation(translation)
          .subscribe((text: string) => {
            this.snackBarService.open(text);
          });
      });
  }

  public google(): void {
    this.blipAuthService.google();
  }

  private async handleError(error: any, email?: string): Promise<string> {
    if (!error.code && error.message) {
      return Promise.resolve(error.message);
    }
    let providers: string[] = [];
    let provider = '';
    let translation = this.blipAuthService.errors(error.code);

    if (error.email || email) {
      providers = await this.blipAuthService.fetchSignInMethods(
        error.email || email
      );
    }

    // Will have more providers if email is linked to another credential
    if (providers.length && !providers.includes('password')) {
      translation = 'AUTH.ACCOUNT_EXISTS';
      if (providers.includes('google.com')) {
        provider = 'Google';
      } else if (providers.includes('facebook.com')) {
        provider = 'Facebook';
      }
    }

    return this.translationService
      .getTranslation(translation, { provider })
      .toPromise();
  }

  public invalidCredentials() {
    this.translationService
      .getTranslation('AUTH.INVALID_CREDENTIALS')
      .subscribe((text: string) => {
        this.errorMessage(text);
      });
  }

  private async isLoggedIn() {
    this.loadingService.setLoading(true);
    try {
      const user = await this.blipAuthService.loggedIn();
      if (!user.emailVerified) {
        this.blipAuthService.sendConfirmationEmail(window.location.href);
        this.router.navigateByUrl(AppRoutes.REGISTER_SUCCESS).then(() => {
          this.loadingService.setLoading(false);
        });
      } else {
        this.translationService
          .getTranslation('LOGIN.RELOGIN')
          .subscribe((text: string) => {
            this.snackBarService.open(text, 1500);
            this.router.navigateByUrl(this.returnUrl).then(() => {
              this.loadingService.setLoading(false);
            });
          });
      }
    } catch (error) {
      if (error) {
        const text = await this.handleError(error);
        this.errorMessage(text);
      }
      this.loadingService.setLoading(false);
    }
  }

  public async loadRedirect() {
    this.loadingService.setLoading(true);
    this.loadingService.setLoadingRedirect(true);

    try {
      const credential = await this.blipAuthService.getRedirectResult();
      if (credential.additionalUserInfo.isNewUser) {
        this.conversionService.registrationCompleted();

        // Create the new user in Firebase DB
        const version = await this.firestoreService.newUser(credential.user);

        // Create a new user in Blip
        const form = {
          email: credential.user.email,
          name: credential.user.displayName,
          password: this.randomString(32),
          phone: credential.user.phoneNumber,
          terms_accepted: false,
          timezone: tz.guess(),
          ui_version: version,
        };
        await this.blipAuthService.registerOnBlip(credential.user, form);
      }

      // Some authentications do not automatically verify your email
      if (!credential.user.emailVerified) {
        this.blipAuthService.sendConfirmationEmail(window.location.href);
        this.router.navigateByUrl(AppRoutes.REGISTER_SUCCESS).then(() => {
          this.loadingService.setLoading(false);
        });
      } else {
        this.translationService
          .getTranslation('LOGIN.SUCCESS')
          .subscribe((text: string) => {
            this.errorMessage(text);
            this.router.navigateByUrl(this.returnUrl).then(() => {
              this.loadingService.setLoading(false);
            });
          });
      }
    } catch (error) {
      if (error) {
        const text = await this.handleError(error);
        this.errorMessage(text);
      } else {
        this.isLoggedIn();
      }
      this.loadingService.setLoading(false);
    } finally {
      this.loadingService.setLoadingRedirect(false);
    }
  }

  public async login(email: string, password: string) {
    this.loadingService.setLoading(true);
    try {
      const credential = await this.blipAuthService.signInWithEmailAndPassword({
        email,
        password,
      });
      if (!credential.user.emailVerified) {
        this.router.navigateByUrl(AppRoutes.REGISTER_SUCCESS);
      } else {
        this.translationService
          .getTranslation('LOGIN.SUCCESS')
          .subscribe((text: string) => {
            this.errorMessage(text);
            this.router.navigateByUrl(this.returnUrl);
          });
      }
    } catch (error) {
      this.handleError(error, email).then((text: string) => {
        this.errorMessage(text);
      });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Create a random alphanumeric string
   * @param length The length of the random string returned
   */
  private randomString(length) {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  public async register(form: RegisterForm): Promise<void> {
    this.loadingService.setLoading(true);
    try {
      // Create form with version appended
      const newForm = { ...form, ...{ terms_accepted: true } };
      newForm.ui_version = VERSION;

      // Register on Firebase and on Blip
      const credential = await this.blipAuthService.register(newForm);
      this.conversionService.registrationCompleted();
      await this.firestoreService.newUser(credential.user);

      // Route to appropriate page
      this.blipAuthService.sendConfirmationEmail(window.location.href);
      this.router.navigateByUrl(AppRoutes.REGISTER_SUCCESS);
    } catch (error) {
      const message = this.blipAuthService.errors(error.code);
      this.translationService
        .getTranslation(message)
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Creates a new user tied to current users organization. Sends email for new user to set their password.
   * @param form
   */
  public async createUserAndSendEmail(form: {
    name: string;
    email: string;
  }): Promise<void> {
    this.loadingService.setLoading(true);
    // Create form with version appended
    const newForm = {
      ...form,
      ...{
        terms_accepted: true,
        ui_version: VERSION,
        timezone: tz.guess(),
        password: this.randomString(32),
      },
    };

    try {
      // Register on Firebase and on Blip
      const user = await this.registerNewUserOnFirebase(newForm);
      await this.blipAuthService.sendPasswordResetEmail(
        newForm.email,
        window.location.href
      );
      await this.firestoreService.newUser(user);
      return Promise.resolve();
    } catch (error) {
      if (error.code !== 'already-exists') {
        const message = this.blipAuthService.errors(error.code);
        this.translationService
          .getTranslation(message)
          .subscribe((text: string) => {
            this.snackBarService.open(text);
          });
        this.loadingService.setLoading(false);
        return Promise.reject(message);
      } else {
        return Promise.resolve();
      }
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Create User on AngularFireAuth and post to blip database
   * @param form
   */
  private async registerNewUserOnFirebase(form: any): Promise<firebase.User> {
    return new Promise(async (resolve, reject) => {
      const createUser = this.afFunctions.httpsCallable('createUser');
      createUser({
        email: form.email,
        password: form.password,
        name: form.name,
      })
        .pipe(take(1))
        .subscribe((user: firebase.User) => {
          resolve(user);
        }, reject);
    });
  }

  /**
   * Create a new user which is tied to the current organization
   * @param user
   * @param form
   */
  public async registerOnBlip(token: string, form: any): Promise<any> {
    return this.http
      .post(`${this.environment.API_URL}/api/account/register/`, form, {
        withCredentials: true,
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .toPromise();
  }
}
