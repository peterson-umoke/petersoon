import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { BLIP_CONFIG, Config } from '../../core.config';
import { ApiResponse, Profile } from '../../models';

interface ApiResponseAndToken extends ApiResponse {
  token: string;
}

const BLIP_COOKIE_NAME = 'b_token';
const BLIP_CUSTOM_TOKEN_NAME = 'b_custom_token';
const BLIP_CUSTOM_COOKIE_NAME = 'bc_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpClient
  ) {}

  /**
   * Change the current users password
   * newPassword
   */
  public changePassword(newPassword: string): Promise<void> {
    return this.afAuth.currentUser.then((user) =>
      user.updatePassword(newPassword)
    );
  }

  /**
   * Clear all cookies associated with Blip Auth
   */
  public async clearCookies() {
    await this.setCookie(
      BLIP_COOKIE_NAME,
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
    );
    await this.setCookie(
      BLIP_CUSTOM_TOKEN_NAME,
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
    );
    await this.setCookie(
      BLIP_CUSTOM_COOKIE_NAME,
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
    );
  }

  /**
   * Return a translation string to use for different Firebase error codes
   * code
   */
  public errors(code: string) {
    let translation: string;
    switch (code) {
      case 'auth/user-not-found':
        translation = 'AUTH.ACCOUNT_NOT_FOUND';
        break;
      case 'auth/account-exists-with-different-credential':
        translation = 'AUTH.ACCOUNT_EXISTS';
        break;
      case 'auth/email-already-in-use':
        translation = 'AUTH.EMAIL_IN_USE';
        break;
      case 'auth/wrong-password':
        translation = 'AUTH.INVALID_CREDENTIALS';
        break;
      case 'auth/user-disabled':
        translation = 'AUTH.DISABLED_ACCOUNT';
        break;
      case 'auth/weak-password':
        translation = 'AUTH.WEAK_PASSWORD';
        break;
      default:
        translation = '';
        break;
    }

    return translation;
  }

  /**
   * Sign in with Facebook redirect
   */
  public facebook(): void {
    this.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  /**
   * Get all sign in methods used for the email provided
   * email
   */
  public fetchSignInMethods(email: string): Promise<string[]> {
    return this.afAuth.fetchSignInMethodsForEmail(email);
  }

  /**
   * Get a cookie by cookie name
   * @param name Cookie Name
   */
  private getCookie(name: string): string {
    const nameLenPlus = name.length + 1;
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => {
          return cookie.substring(0, nameLenPlus) === `${name}=`;
        })
        .map((cookie) => {
          return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || null
    );
  }

  /**
   * Check redirect result
   */
  public async getRedirectResult(): Promise<firebase.auth.UserCredential> {
    try {
      const credentials = await this.afAuth.getRedirectResult();
      if (credentials.user) {
        return Promise.resolve(credentials);
      } else {
        return Promise.reject();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async getToken(user: firebase.User): Promise<string> {
    if (!user) {
      return Promise.reject();
    }

    return user.getIdToken(true);
  }

  /**
   * Sign in with Google redirect
   */
  public google(): void {
    this.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * Check if there is a valid user logged in or not
   */
  public loggedIn(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      if (this.getCookie(BLIP_CUSTOM_TOKEN_NAME)) {
        this.registerUserOnApp()
          .then((credentials: firebase.auth.UserCredential) =>
            resolve(credentials.user)
          )
          .catch(reject);
      } else {
        const subscription = this.afAuth.user.subscribe(
          (user: firebase.User) => {
            subscription.unsubscribe();
            if (user) {
              this.setJWTToken(user)
                .then(() => resolve(user))
                .catch(() => reject());
            } else {
              reject();
            }
          }
        );
      }
    });
  }

  /**
   * Logout of firebase and clear local storage
   */
  public async logout() {
    await this.setCookie(
      BLIP_CUSTOM_COOKIE_NAME,
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
    );
    return this.afAuth.signOut();
  }

  /**
   * Register a new user using email and password
   * form
   */
  public async register(form: any): Promise<firebase.auth.UserCredential> {
    try {
      const credentials = await this.afAuth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      await this.registerOnBlip(credentials.user, form);
      return Promise.resolve(credentials);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Create a user on the Blip Marketplace
   * form
   */
  public async registerOnBlip(user: firebase.User, form: any): Promise<any> {
    try {
      await this.setJWTToken(user);
      return this.http
        .post(`${this.config.API_URL}/api/account/register/`, form, {
          withCredentials: true,
        })
        .toPromise();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Register the currently signed in user on child Blip app
   */
  private async registerUserOnApp(): Promise<firebase.auth.UserCredential> {
    try {
      const cookie = this.getCookie(BLIP_CUSTOM_TOKEN_NAME);
      const credentials = await this.afAuth.signInWithCustomToken(cookie);
      this.clearCookies();
      await this.setJWTToken(credentials.user);
      return Promise.resolve(credentials);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Send an email to reset password
   * email
   */
  public sendPasswordResetEmail(
    email: string,
    returnUrl: string
  ): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email, { url: returnUrl });
  }

  /**
   * Set a cookie based off of the name and value provided
   * @param name The name of the cookie
   * @param value The value of the cookie
   */
  private setCookie(name: string, value: string): Promise<void> {
    let cookie = `${name}=${value}`;
    if (document.location.href.includes('blipbillboards.com')) {
      cookie += ';domain=blipbillboards.com;secure';
    }
    document.cookie = cookie;

    return Promise.resolve();
  }

  /**
   * Set a custom token from Blip server from the provided api url
   * @param user The user to set the custom token for
   */
  public async setCustomToken(user: firebase.User): Promise<Profile> {
    await this.setTokenForServer(user);
    try {
      const resp = await this.http
        .get<ApiResponseAndToken>(`${this.config.API_URL}/api/account/login/`, {
          withCredentials: true,
        })
        .toPromise();
      // Ensure that the custom token is deleted
      await this.clearCookies();
      await this.setCookie(BLIP_CUSTOM_TOKEN_NAME, resp.token);
      return Promise.resolve(resp.result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * For certain calls, it may be necessary to have the JWT set for the custom token
   * @param user Currently signed in user
   */
  public async setJWTToken(user: firebase.User): Promise<void> {
    const JWT = await this.getToken(user);
    await this.setCookie(BLIP_CUSTOM_COOKIE_NAME, JWT);
    return Promise.resolve();
  }

  /**
   * Set the b_token for for server to respond with custom token
   * user
   */
  private async setTokenForServer(user: firebase.User): Promise<firebase.User> {
    const JWT = await this.getToken(user);
    await this.setCookie(BLIP_COOKIE_NAME, JWT);
    return Promise.resolve(user);
  }

  /**
   * Login with an email and password
   * credentials
   */
  public async signInWithEmailAndPassword(credentials: {
    email: string;
    password: string;
  }): Promise<firebase.auth.UserCredential> {
    try {
      const firebaseCredentials = await this.afAuth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      return Promise.resolve(firebaseCredentials);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Send an email confirmation email
   */
  public sendConfirmationEmail(returnUrl: string): Promise<void> {
    return this.afAuth.currentUser.then((user) =>
      user.sendEmailVerification({
        url: returnUrl,
      })
    );
  }

  /**
   * Sign in with redirect provider
   * provider
   */
  private signInWithRedirect(provider: firebase.auth.AuthProvider): void {
    this.afAuth.signInWithRedirect(provider);
  }
}
