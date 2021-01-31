import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationApiService, ProfileApiService } from '../../api';
import { HTTPService } from '../../api/http/http.service';
import {
  Environment,
  FirestoreUser,
  NotificationFrequency,
  Organization,
  OrganizationInfo,
  Profile,
  User,
  UserPreference,
} from '../../models';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../loading/loading.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private profileText: string;
  private profile: BehaviorSubject<Profile> = new BehaviorSubject<Profile>(
    null
  );
  private selectedOrganization: BehaviorSubject<
    Organization
  > = new BehaviorSubject<Organization>(null);
  private selectedOrgBillable: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private selectedOrgInfo: BehaviorSubject<
    OrganizationInfo
  > = new BehaviorSubject<OrganizationInfo>(null);
  private userText: string;

  public firestoreUserDoc: AngularFirestoreDocument<FirestoreUser>;
  public organization: Organization;
  public $profile: Observable<Profile> = this.profile.asObservable();
  public $selectedOrganization: Observable<
    Organization
  > = this.selectedOrganization.asObservable();
  public $selectedOrgBillable: Observable<
    boolean
  > = this.selectedOrgBillable.asObservable();
  public $selectedOrgInfo: Observable<
    OrganizationInfo
  > = this.selectedOrgInfo.asObservable();

  public isTemplateManager = false;

  constructor(
    private authService: AuthService,
    private http: HTTPService,
    private loadingService: LoadingService,
    private organizationApiService: OrganizationApiService,
    private profileApiService: ProfileApiService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private environment: Environment
  ) {
    this.translationService
      .getTranslation('PROFILE.TEXT')
      .subscribe((text: string) => {
        this.profileText = text;
      });
    this.translationService.getTranslation('USER').subscribe((text: string) => {
      this.userText = text;
    });
  }

  /**
   * Adds User to current organization
   * @param user
   */
  public async addUserToOrg(newUser: {
    first_name: string;
    last_name: string;
    email: string;
    roles: Array<string>;
  }): Promise<any> {
    const form = {
      name: newUser.first_name + ' ' + newUser.last_name,
      email: newUser.email,
    };

    try {
      // Creates user in firebase and backend
      await this.authService.createUserAndSendEmail(form);
      // Adds new user to current organization
      return this.http
        .post(
          `${this.environment.API_URL}/api/account/users/${this.organization.id}/`,
          { ...newUser, activate: true }
        )
        .toPromise();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Change to a new organization
   * @param organization
   */
  public changeOrganization(organization: Organization) {
    // Do not change to the same organization
    return new Promise((resolve) => {
      if (!this.organization || this.organization.id !== organization.id) {
        this.organizationApiService
          .getInfo(organization.id)
          .toPromise()
          .then((orgInfo: OrganizationInfo) => {
            this.organization = organization;
            this.selectedOrganization.next(organization);
            this.selectedOrgInfo.next(orgInfo);
            localStorage.setItem('org', organization.id);
            this.updateOrgBillable(orgInfo);
          })
          .catch((err) => {
            console.log(`ERROR ${err}`);
          })
          .then(() => {
            resolve();
          });
      }
    });
  }

  public createOrganization(organization: Organization) {
    const newOrgs = [...this.profile.value.organizations, organization];
    const newProfile = { ...this.profile.value };
    newProfile.organizations = newOrgs;
    this.profile.next(newProfile);
    this.changeOrganization(organization);
  }

  public deleteOrganization(organizationId: string) {
    const newOrgs = this.profile.value.organizations.filter(
      (org: Organization) => {
        return organizationId !== org.id;
      }
    );
    const newProfile = { ...this.profile.value };
    newProfile.organizations = newOrgs;
    this.profile.next(newProfile);
  }

  /**
   * Delete given user from the current organization
   * @param organizationId current organization
   * @param userId user to delete
   */
  public deleteUserFromOrg(
    organizationId: string,
    userId: string
  ): Promise<any> {
    return new Promise((resolve) => {
      this.http
        .delete(
          `${this.environment.API_URL}/api/account/users/${organizationId}/${userId}`
        )
        .toPromise()
        .then(() => {
          this.translationService
            .getTranslation('SUCCESS.DELETING', { type: this.userText })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          this.getUsersFromOrg(this.organization.id);
          resolve();
        })
        .catch(() => {
          this.translationService
            .getTranslation('ERROR.DELETING', { type: this.userText })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve();
        })
        .then(() => this.loadingService.setLoading(false));
    });
  }

  private async getOrganization(orgId: string): Promise<Organization> {
    try {
      const organization = await this.organizationApiService
        .get(orgId)
        .toPromise();
      return Promise.resolve(organization);
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  /**
   * Check for `org` query param and set the organization to it
   * @param route
   */
  private async getOrganizationFromQueryParam(
    route: ActivatedRouteSnapshot
  ): Promise<Organization> {
    if (route) {
      const orgParam = route.queryParams['org'];
      if (orgParam) {
        return this.getOrganization(orgParam);
      }
    }
    return Promise.resolve(null);
  }

  /**
   * Get users notification preferences
   */
  public async getNotificationPreferences(): Promise<any> {
    return this.http.get(`${this.environment.API_URL}/api/email/`).toPromise();
  }

  public async getProfile(
    route: ActivatedRouteSnapshot = null,
    reloadProfile: boolean = false
  ) {
    if (reloadProfile || !this.profile.value) {
      const profile = await this.profileApiService.get().toPromise();
      const organizationFromQueryParam = await this.getOrganizationFromQueryParam(
        route
      );
      this.setProfile(profile, organizationFromQueryParam);
    }
  }
  /**
   * Get a user associated with the current organization
   * @param organizationId
   */
  public async getUserFromOrg(orgId: string, userId: string): Promise<any> {
    return this.http
      .get(`${this.environment.API_URL}/api/account/users/${orgId}/${userId}`)
      .toPromise();
  }

  /**
   * Get users associated with the current organization
   * @param organizationId current organization
   */
  public async getUsersFromOrg(organizationId: string): Promise<any> {
    return this.http
      .get(`${this.environment.API_URL}/api/account/users/${organizationId}/`)
      .toPromise();
  }

  public reloadOrganizationInfo() {
    return new Promise((resolve) => {
      if (this.organization && this.organization.id) {
        this.organizationApiService
          .getInfo(this.organization.id)
          .toPromise()
          .then((orgInfo: OrganizationInfo) => {
            this.selectedOrgInfo.next(orgInfo);
            this.updateOrgBillable(orgInfo);
          })
          .catch((err) => {
            console.log(`ERROR ${err}`);
          })
          .then(() => {
            resolve();
          });
      }
    });
  }

  public reset(): void {
    this.selectedOrganization.next(null);
    this.selectedOrgInfo.next(null);
    this.profile.next(null);
    this.organization = null;
  }

  /**
   * The user just logged in
   * @param profile
   */
  private async setProfile(
    profile: Profile,
    organizationFromQueryParam: Organization
  ) {
    this.profile.next(profile);
    const localOrg = localStorage.getItem('org');

    if (profile.user.preferences.language) {
      // Make sure the users profile preference language is set if localStorage is different
      const language = localStorage.getItem('language');
      if (language && language !== profile.user.preferences.language) {
        this.translationService.setTranslation(
          profile.user.preferences.language
        );
      }
    }

    if (organizationFromQueryParam) {
      this.changeOrganization(organizationFromQueryParam);
    } else if (profile) {
      const org = this.profile.value.organizations.filter(
        (profileOrg: Organization) => {
          return profileOrg.id === localOrg;
        }
      );

      // Organization exists in available organizations
      if (org.length) {
        this.changeOrganization(org[0]);
      } else {
        if (localOrg) {
          // Should only get here if there was an org query param and the
          // organization does not exist in the users profile
          const orgFromLocalStorage = await this.getOrganization(localOrg);
          if (orgFromLocalStorage) {
            this.changeOrganization(orgFromLocalStorage);
          }
        } else if (this.profile.value.organizations.length) {
          this.changeOrganization(this.profile.value.organizations[0]);
        }
      }
    }
  }

  /**
   * Update terms accepted
   */
  public async terms(): Promise<any> {
    return new Promise((resolve, reject) => {
      const profile = this.profile.value;
      const user = { ...profile.user };
      user.terms_accepted = true;
      profile.user = user;
      this.updateProfile(profile)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Update terms accepted
   */
  public async termsAccepted(showSnackBar: boolean = false): Promise<any> {
    this.loadingService.setLoading(true);
    return new Promise((resolve) => {
      this.terms()
        .then(() => {
          if (showSnackBar) {
            this.translationService
              .getTranslation('SUCCESS.UPDATING', { type: this.profileText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
          }
          resolve();
        })
        .catch(() => {
          if (showSnackBar) {
            this.translationService
              .getTranslation('ERROR.SAVING', { type: this.profileText })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
          }
          resolve();
        })
        .then(() => this.loadingService.setLoading(false));
    });
  }

  /**
   * Update a users profile
   * @param profile
   */
  public update(profile: Profile): Promise<any> {
    return this.profileApiService
      .update(profile.user)
      .toPromise()
      .then((user) => {
        profile.user = user;
        this.setProfile(profile, null);
      });
  }

  public updateOrganization(organization: Organization) {
    const newOrgs = [...this.profile.value.organizations];
    newOrgs.forEach((org: Organization, index: number) => {
      if (org.id === organization.id) {
        org = { ...organization };
      }
    });
    const newProfile = { ...this.profile.value };
    newProfile.organizations = newOrgs;
    this.profile.next(newProfile);
  }

  /**
   * Update users notification preferences
   * @param notification
   */
  public async updateNotificationPreferences(
    notification: NotificationFrequency
  ): Promise<any> {
    return this.http
      .put(
        `${this.environment.API_URL}/api/email/${notification.id}`,
        notification
      )
      .toPromise();
  }

  public async updateUserPreferences(
    preferences: Partial<UserPreference>
  ): Promise<any> {
    const profile = { ...this.profile.value };

    Object.keys(preferences).forEach((key: string) => {
      profile.user.preferences[key] = preferences[key];
    });

    return this.update(profile);
  }

  /**
   * Update Profile info
   */
  public async updateProfile(profile: Profile): Promise<any> {
    this.loadingService.setLoading(true);
    return new Promise((resolve) => {
      this.update(profile)
        .then(() => {
          this.translationService
            .getTranslation('USERS.SUCCESS_UPDATING')
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          this.getProfile(null, true);
          resolve();
        })
        .catch(() => {
          this.translationService
            .getTranslation('USERS.ERROR_UPDATING')
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve();
        })
        .then(() => this.loadingService.setLoading(false));
    });
  }

  /**
   * Update a given user from the current organizations list of users
   * @param user
   */
  public async updateUserFromOrg(
    organizationId: string,
    user: User
  ): Promise<any> {
    this.loadingService.setLoading(true);

    return new Promise((resolve) => {
      this.http
        .put(
          `${this.environment.API_URL}/api/account/users/${organizationId}/${user.id}`,
          user
        )
        .toPromise()
        .then(() => {
          this.translationService
            .getTranslation('SUCCESS.UPDATING', { type: this.userText })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          this.getUsersFromOrg(this.organization.id);
          resolve();
        })
        .catch(() => {
          this.translationService
            .getTranslation('ERROR.SAVING', { type: this.userText })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve();
        })
        .then(() => this.loadingService.setLoading(false));
    });
  }

  private updateOrgBillable(orgInfo: OrganizationInfo) {
    if (orgInfo.funded && !orgInfo['prepay-only']) {
      // We have a valid credit card on file.
      this.selectedOrgBillable.next(true);
    } else if (orgInfo.spendable && orgInfo.burntime) {
      // User has info.burntime days remaining to spend
      this.selectedOrgBillable.next(true);
    } else if (orgInfo.spendable && orgInfo.burntime === null) {
      // At least 30 days of burntime remaining.
      this.selectedOrgBillable.next(true);
    } else {
      // There are no cards and no prepaid amount
      this.selectedOrgBillable.next(false);
    }
  }
}
