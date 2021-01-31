import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot } from '@angular/router';
import firebase from 'firebase';
import * as moment from 'moment';
import { Endpoint, FirestoreUser } from '../../models';
import { AdsService } from '../../services/ads/ads/ads.service';
import { VerificationsService } from '../../services/ads/verifications/verifications.service';
import { CampaignService } from '../../services/campaign/campaign.service';
import { CampaignsService } from '../../services/campaigns/campaigns.service';
import { LoadingService } from '../../services/loading/loading.service';
import { PaymentService } from '../../services/payment/payment.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services_lib/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthAPIService {
  constructor(
    private adsService: AdsService,
    private authService: AuthService,
    private campaignService: CampaignService,
    private campaignsService: CampaignsService,
    private firestore: AngularFirestore,
    private loadingService: LoadingService,
    private paymentService: PaymentService,
    private userService: UserService,
    private verificationsService: VerificationsService
  ) {}

  /**
   * Change the current users password
   * @param newPassword
   */
  public changePassword(newPassword: string): Promise<any> {
    return this.authService.changePassword(newPassword);
  }

  /**
   * Check if there is a valid user logged in or not
   * @param refreshToken Whether or not to hard refresh the Firebase ID Token
   */
  public async checkLogin(
    route: ActivatedRouteSnapshot
  ): Promise<firebase.User> {
    try {
      const user = await this.authService.loggedIn();
      if (user) {
        this.userService.firestoreUserDoc = this.firestore.doc<FirestoreUser>(
          `users/${user.uid}`
        );
        this.userService.firestoreUserDoc.get().subscribe((snapshot) => {
          this.userService.isTemplateManager = !!snapshot.data()
            .templateManager;
          if (!snapshot.exists) {
            this.userService.firestoreUserDoc.set({
              endpointKey: Endpoint.v2,
              lastEndpoint: Endpoint.v2,
              lastLogin: moment(new Date()).format('X'),
              existingUser: true,
            });
          } else {
            this.userService.firestoreUserDoc.update({
              lastLogin: moment(new Date()).format('X'),
              lastEndpoint: Endpoint.v2,
            });
          }
        });
        await this.userService.getProfile(route);
        return Promise.resolve(user);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Return a translation string to use for different Firebase error codes
   * @param code
   */
  public errors(code: string) {
    return this.authService.errors(code);
  }

  public logout() {
    this.loadingService.setLoading(true);
    return new Promise((resolve, reject) => {
      this.authService
        .logout()
        .then(() => {
          localStorage.clear();
          this.reset();
          resolve();
        })
        .catch(reject)
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  private reset() {
    this.adsService.reset();
    this.campaignService.reset();
    this.campaignsService.reset();
    this.paymentService.reset();
    this.userService.reset();
    this.verificationsService.reset();
  }
}
