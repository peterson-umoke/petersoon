import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import {
  Environment,
  NotificationFrequency,
  PhoneNumberService,
  Profile,
  SnackBarService,
  TranslationService,
  UserPreference,
  UserService,
} from '@marketplace/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment as CAEnv } from '../../../../apps/Marketplace/src/environments/environment.prod-ca';

const PHONE_REGEX = /^\([0-9]{3}\) [0-9]{3} - [0-9]{4}$/;
const NOTIFICATION_ORDERING = {
  ON_CHANGE: 1,
  ONCE: 2,
  DAILY: 3,
  WEEKLY: 4,
  MONTHLY: 5,
  NEVER: 6,
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit, OnDestroy {
  public notificationData = {
    'Campaign Debuts': {
      order: 1,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/green_star.svg',
    },
    'Limited Availability': {
      order: 2,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/red_cancel.svg',
    },
    'Campaign Reports': {
      order: 3,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/blue_pages.svg',
    },
    'Image Moderation Updates': {
      order: 4,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/purple_image_add.svg',
    },
    'Expiring Slot Assignments': {
      order: 5,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/green_star.svg',
    },
    'Staff Image Moderation Alerts': {
      order: 6,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/green_star.svg',
    },
    'T1 Moderation ToDos [Blip Only]': {
      order: 7,
      icon:
        'https://blipbillboards-marketplace.s3.amazonaws.com/svg/green_star.svg',
    },
  };
  public notificationPreferences: Array<NotificationFrequency>;
  public preferences: UserPreference = {
    language: this.environment.LOCALE_ID,
    currency: this.environment.CURRENCY_CODE,
  };
  public profileForm = new FormGroup({
    first_name: new FormControl(null),
    last_name: new FormControl(null),
    phone: new FormControl(null, Validators.pattern(PHONE_REGEX)),
    timezone: new FormControl(null),
  });
  public showPreferences = true;

  private profile: Profile;
  private onExitSubject = new Subject();

  constructor(
    private phoneNumberService: PhoneNumberService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private translationService: TranslationService,
    private userService: UserService,
    private environment: Environment
  ) {
    this.showPreferences =
      this.environment.CURRENCY_CODE !== CAEnv.CURRENCY_CODE;

    this.setProfile();

    this.translateService.onLangChange
      .pipe(takeUntil(this.onExitSubject))
      .subscribe(async (langChange: LangChangeEvent) => {
        this.preferences.language = langChange.lang;

        try {
          await this.userService.updateUserPreferences({
            language: langChange.lang,
          });
          this.snackBarService.openTranslation('PREFERENCES.UPDATE.SUCCESS');
        } catch (error) {
          this.snackBarService.openTranslation('PREFERENCES.UPDATE.ERROR');
        }
      });

    const language = localStorage.getItem('language');
    if (language) {
      this.preferences.language = language;
    }
  }

  async ngOnInit() {
    const response = await this.userService.getNotificationPreferences();
    const notifications: Array<NotificationFrequency> = response.result;
    notifications.forEach((notification: NotificationFrequency) => {
      notification.frequency_options.sort(
        (optionA: string, optionB: string) =>
          NOTIFICATION_ORDERING[optionA] - NOTIFICATION_ORDERING[optionB]
      );
    });

    notifications.sort(
      (a: NotificationFrequency, b: NotificationFrequency) =>
        this.notificationData[a.friendly_name].order -
        this.notificationData[b.friendly_name].order
    );
    this.notificationPreferences = notifications;
  }

  ngOnDestroy() {
    const first = this.profileForm.controls.first_name.value;
    const firstChanged = first !== this.profile.user.first_name;
    const last = this.profileForm.controls.last_name.value;
    const lastChanged = last !== this.profile.user.last_name;
    const phone = this.phoneNumberService.cleanPhoneNumber(
      this.profileForm.controls.phone.value
    );
    const phoneChanged = phone !== this.profile.user.phone;
    if (firstChanged || lastChanged || phoneChanged) {
      this.updateProfile();
    }

    this.onExitSubject.next();
    this.onExitSubject.complete();
  }

  public async changeCurrency(change: MatButtonToggleChange) {
    this.preferences.currency = change.value;
    try {
      await this.userService.updateUserPreferences({
        currency: this.preferences.currency,
      });
      this.snackBarService.openTranslation('PREFERENCES.UPDATE.SUCCESS');
    } catch (error) {
      this.snackBarService.openTranslation('PREFERENCES.UPDATE.ERROR');
    }
  }

  public async changeLanguage(change: MatButtonToggleChange) {
    this.translationService.setTranslation(change.value);
  }

  /**
   * Set user profile form
   */
  private setProfile() {
    const profileSubject = new Subject();
    this.userService.$profile
      .pipe(takeUntil(profileSubject))
      .subscribe((profile: Profile) => {
        if (profile) {
          this.profile = profile;
          const user = profile.user;
          this.profileForm.patchValue({
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            timezone: user.timezone,
          });

          const language = user.preferences.language;
          if (language) {
            this.preferences.language = language;
          }
          const currency = user.preferences.currency;
          if (currency) {
            this.preferences.currency = currency;
          }

          profileSubject.next();
          profileSubject.complete();
        } else {
          this.profileForm.patchValue({
            first_name: null,
            last_name: null,
            phone: null,
            timezone: null,
          });
        }
      });
  }

  /**
   * Updates the notification
   * @param notification
   */
  public async updateNotificationPreferences(
    notification: NotificationFrequency
  ) {
    try {
      await this.userService.updateNotificationPreferences(notification);
      this.snackBarService.openTranslation('SUCCESS.UPDATING', {
        key: 'type',
        translation: 'NOTIFICATION',
      });
    } catch (error) {
      this.snackBarService.openTranslation('ERROR.UPDATING', {
        key: 'type',
        translation: 'NOTIFICATION',
      });
    }
  }

  /**
   * Update the user profile
   */
  public async updateProfile() {
    this.profile.user.first_name = this.profileForm.controls.first_name.value;
    this.profile.user.last_name = this.profileForm.controls.last_name.value;
    this.profile.user.phone = this.phoneNumberService.cleanPhoneNumber(
      this.profileForm.controls.phone.value
    );
    this.profile.user.timezone = this.profileForm.controls.timezone.value;

    try {
      await this.userService.updateProfile(this.profile);
      this.snackBarService.openTranslation('SUCCESS.UPDATING', {
        key: 'type',
        translation: 'PROFILE.TEXT',
      });
    } catch (error) {
      this.snackBarService.openTranslation('ERROR.UPDATING', {
        key: 'type',
        translation: 'PROFILE.TEXT',
      });
    }
  }
}
