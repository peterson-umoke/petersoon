import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { CampaignApiService } from '../../api';
import { AppRoutes, CampaignRoutes, CampaignTypes } from '../../enums';
import {
  Campaign,
  CampaignChecklist,
  Environment,
  Organization,
} from '../../models';
import { LoadingService } from '../loading/loading.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { TranslationService } from '../translation/translation.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private campaigns = {
    active: [] as Array<Campaign>,
    archived: [] as Array<Campaign>,
    draft: [] as Array<Campaign>,
  };
  private campaignsChange: Subject<boolean> = new Subject<boolean>();
  private translations = { campaign: '', campaigns: '' };

  public $campaignChange: Observable<
    boolean
  > = this.campaignsChange.asObservable();
  public hasCampaigns: boolean;

  constructor(
    private campaignApiService: CampaignApiService,
    private loadingService: LoadingService,
    private router: Router,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private userService: UserService,
    private environment: Environment
  ) {
    this.resetCampaigns();

    this.translationService
      .getTranslation(['CAMPAIGN.TEXT', 'CAMPAIGNS.TEXT'])
      .subscribe((text: Array<string>) => {
        this.translations.campaign = text['CAMPAIGN.TEXT'].toLowerCase();
        this.translations.campaigns = text['CAMPAIGNS.TEXT'].toLowerCase();
      });

    this.userService.$selectedOrganization.subscribe((org) => {
      this.reset();
    });
  }

  private assignStatuses(campaigns: Array<Campaign>): Array<Campaign> {
    const today = moment();
    return campaigns.map((campaign: Campaign) => {
      let status: string, show_play_pause: boolean;
      if (moment(campaign.end_date).isSame(today, 'day')) {
        status = 'CAMPAIGN.TYPE.ENDING';
        show_play_pause = true;
      } else if (moment(campaign.end_date).isBefore(today, 'day')) {
        status = 'CAMPAIGN.TYPE.ENDED';
        show_play_pause = false;
      } else if (moment(campaign.start_date).isSame(today, 'day')) {
        status = 'CAMPAIGN.TYPE.STARTING';
        show_play_pause = true;
      } else if (moment(campaign.start_date).isAfter(today, 'day')) {
        status = 'CAMPAIGN.TYPE.PENDING';
        show_play_pause = true;
      } else if (campaign.deleted) {
        status = 'ARCHIVED';
        show_play_pause = false;
      } else if (!campaign.enabled) {
        status = 'CAMPAIGN.TYPE.PAUSED';
        show_play_pause = true;
      } else if (campaign.enabled) {
        status = 'CAMPAIGN.TYPE.LIVE';
        show_play_pause = true;
      }
      return campaign.clone({ status, show_play_pause });
    });
  }

  /**
   * Assign campaign stats information
   * @param campaign
   */
  private assignValues(campaign: Campaign): Campaign {
    const notifications = this.setNotifications(campaign);

    const yesterdayDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    let yesterday_blips = 0,
      week_blips = 0;

    campaign.daily.forEach((value) => {
      if (moment(value.day).isSame(yesterdayDate, 'day')) {
        yesterday_blips = value.blips;
      }
      if (
        moment(value.day).isBetween(
          moment().startOf('week'),
          moment().endOf('week'),
          'day',
          '[]'
        )
      ) {
        week_blips += value.blips;
      }
    });

    return campaign.clone({ notifications, yesterday_blips, week_blips });
  }

  public archiveCampaign(campaign: Campaign): Promise<Campaign> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.campaignApiService
        .delete(campaign.id)
        .toPromise()
        .then(() => {
          this.requeryCampaigns();
          this.translationService
            .getTranslation('SUCCESS.ARCHIVING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(campaign.clone({ deleted: true }));
        })
        .catch((error) => {
          this.translationService
            .getTranslation('ERROR.ARCHIVING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  /**
   * Hides the campaign based on `hide` field
   * @param campaign
   */
  public deleteCampaign(campaign: Campaign): Promise<void> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.campaignApiService
        .update(campaign.clone({ hidden: true }))
        .toPromise()
        .then(() => {
          this.requeryCampaigns();
          this.translationService
            .getTranslation('SUCCESS.DELETING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve();
        })
        .catch((error) => {
          this.translationService
            .getTranslation('ERROR.DELETING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public getCampaignChecklist(campaign: Campaign): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      this.campaignApiService
        .checklist(campaign.id)
        .toPromise()
        .then((checklist: CampaignChecklist) => {
          resolve(
            campaign.clone({
              checklist,
            })
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public getCampaignStats(
    organization: Organization,
    campaign: Campaign
  ): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      this.campaignApiService
        .stats(organization.id, campaign.id)
        .toPromise()
        .then((campaignStats: Campaign) => {
          resolve(this.assignValues(campaign.clone(campaignStats)));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public getCampaignType(type: CampaignTypes): Promise<Array<Campaign>> {
    return new Promise((resolve) => {
      if (!this.campaigns[type].length) {
        this.loadingService.setLoading(true);
        this.campaignApiService
          .list(this.userService.organization.id, type)
          .toPromise()
          .then((campaigns: Array<Campaign>) => {
            const assignedCampaigns = this.assignStatuses(campaigns);
            this.campaigns[type] = assignedCampaigns;
            resolve(assignedCampaigns);
          })
          .catch((err) => {
            this.translationService
              .getTranslation('ERROR.LOADING', {
                type: this.translations.campaigns,
              })
              .subscribe((text: string) => {
                this.snackBarService.open(text);
              });
          })
          .then(() => {
            this.loadingService.setLoading(false);
          });
      } else {
        resolve(this.campaigns[type]);
      }
    });
  }

  /**
   * Navigate to correct page depending on campaign status
   * @param campaign
   */
  public goToPage(campaign: Campaign): void {
    let url: string;
    const today = moment();

    if (campaign.deleted || moment(campaign.end_date).isBefore(today)) {
      // Archived
      url = AppRoutes.CAMPAIGNS_ARCHIVED;
    } else if (!campaign.enabled && !campaign.first_shown) {
      // Drafted
      url = AppRoutes.CAMPAIGNS_DRAFTS;
    } else {
      // Active
      url = AppRoutes.CAMPAIGNS;
    }

    this.router.navigateByUrl(url);
  }

  /**
   * Right now, requery all campaign types
   * TODO: Run a check on campaign change to move to different type
   */
  private requeryCampaigns(): void {
    this.resetCampaigns();
    this.campaignsChange.next(true);
  }

  public reset(): void {
    this.resetCampaigns();
    this.hasCampaigns = false;
  }

  private resetCampaigns(): void {
    this.campaigns[CampaignTypes.ACTIVE] = [] as Campaign[];
    this.campaigns[CampaignTypes.ARCHIVED] = [] as Campaign[];
    this.campaigns[CampaignTypes.DRAFT] = [] as Campaign[];
  }

  /**
   * Set notifications for each campaign
   * @param campaign
   */
  public setNotifications(
    campaign: Campaign
  ): Array<{ key: string; params: {} }> {
    const notifications: Array<{ key: string; params: {} }> = [];
    if (!campaign.checklist.campaign_enabled) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.NOT_ENABLED',
        params: {
          linkFunction: () => {
            campaign = campaign.clone({ enabled: true });
            this.updateCampaign(campaign).then((savedCampaign: Campaign) => {
              this.goToPage(savedCampaign);
            });
          },
          linkText: 'UNPAUSE',
        },
      });
    }
    if (!campaign.checklist.org_has_daily_spend) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.NO_CARD',
        params: {
          linkFunction: () => {
            this.router.navigateByUrl(AppRoutes.cardDetails(AppRoutes.CARDS));
          },
          linkText: 'UPDATE_PAYMENTS',
        },
      });
    }
    // TODO end_date may not be accurate, will need to retrieve last flip date
    if (campaign.checklist.campaign_has_ended) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.ENDED',
        params: {
          date: formatDate(
            campaign.end_date,
            'MM/d/yyyy',
            this.environment.LOCALE_ID
          ),
          linkFunction: () => {
            this.router.navigateByUrl(
              AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.SCHEDULE)
            );
          },
          linkText: 'CHANGE_SCHEDULE',
        },
      });
    }
    if (!campaign.checklist.signs_with_images.length) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.NO_ADS',
        params: {
          linkFunction: () => {
            this.router.navigateByUrl(
              AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.ARTWORK)
            );
          },
          linkText: 'UPLOAD_ARTWORK',
        },
      });
    } else if (Object.keys(campaign.checklist.signs_without_images).length) {
      const signsObj = campaign.checklist.signs_without_images;
      const sizesString = '';
      Object.keys(signsObj).forEach((key, index) => {
        if (signsObj[key].signs.length) {
          sizesString.concat(`${signsObj[key].width}x${signsObj[key].height}`);
          if (index !== Object.keys(signsObj).length - 1) {
            sizesString.concat(', ');
          }
        }
      });
      if (sizesString.length) {
        notifications.push({
          key: 'CAMPAIGN.NOTIFICATIONS.SIGNS_WITHOUT_IMAGES',
          params: {
            linkFunction: () => {
              this.router.navigateByUrl(
                AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.ARTWORK)
              );
            },
            linkText: 'UPLOAD_ARTWORK',
            sizes: sizesString,
          },
        });
      }
    }
    if (campaign.checklist.all_signs_unavailable) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.ALL_SIGNS_UNAVAILABLE',
        params: {
          linkFunction: () => {
            this.router.navigateByUrl(
              AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.LOCATIONS)
            );
          },
          linkText: 'CHANGE_SIGNS',
        },
      });
    }
    if (campaign.checklist.pending_verifications) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.VERIFICATIONS',
        params: {
          linkFunction: () => {
            this.router.navigateByUrl(AppRoutes.AD_VERIFICATIONS);
          },
          linkText: 'VERIFY_IMAGES',
        },
      });
    }
    if (campaign.checklist.all_signs_disabled) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.ALL_SIGNS_DISABLED',
        params: {
          linkFunction: () => {
            this.router.navigateByUrl(
              AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.LOCATIONS)
            );
          },
          linkText: 'CHANGE_SIGNS',
        },
      });
    }
    if (campaign.someApproved && !campaign.someRejected) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.MODERATION.SOME_APPROVED',
        params: {},
      });
    }
    if (campaign.someRejected && !campaign.someApproved) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.MODERATION.SOME_REJECTED',
        params: {},
      });
    }
    if (campaign.someApproved && campaign.someRejected) {
      notifications.push({
        key: 'CAMPAIGN.NOTIFICATIONS.MODERATION.SOME_APPROVED_SOME_REJECTED',
        params: {},
      });
    }

    return notifications;
  }

  public saveCampaign(campaign: Campaign): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.campaignApiService
        .save(campaign)
        .toPromise()
        .then((savedCampaign: Campaign) => {
          this.requeryCampaigns();
          this.translationService
            .getTranslation('SUCCESS.SAVING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(savedCampaign);
        })
        .catch((error) => {
          this.translationService
            .getTranslation('ERROR.SAVING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          reject(error);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public unarchiveCampaign(campaign: Campaign): Promise<Campaign> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.campaignApiService
        .unarchive(campaign)
        .toPromise()
        .then(() => {
          this.requeryCampaigns();
          this.translationService
            .getTranslation('SUCCESS.UNARCHIVING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(campaign.clone({ deleted: null }));
        })
        .catch((error) => {
          this.translationService
            .getTranslation('ERROR.UNARCHIVING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  public updateCampaign(campaign: Campaign): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading(true);
      this.campaignApiService
        .update(campaign)
        .toPromise()
        .then((updatedCampaign: Campaign) => {
          this.requeryCampaigns();
          this.translationService
            .getTranslation('SUCCESS.UPDATING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(updatedCampaign);
        })
        .catch((error) => {
          this.translationService
            .getTranslation('ERROR.UPDATING', {
              type: this.translations.campaign,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          reject(error);
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }
}
