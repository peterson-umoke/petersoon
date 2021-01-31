import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppRoutes,
  Campaign,
  CampaignsService,
  CampaignTypes,
  FilterPipe,
  Organization,
  OrganizationInfo,
  RouterService,
  SearchService,
  SnackBarService,
  TranslationService,
  UserService,
  ViewType,
  ViewTypeService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';
import { first, take } from 'rxjs/operators';

export enum Page {
  ACTIVE,
  ARCHIVED,
  DRAFTS,
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
})
export class CampaignsComponent implements OnInit, OnDestroy {
  private searchTerm: string;
  private subscriptions = new Subscription();
  private selectedOrg: Organization;

  public allCampaigns: Array<Campaign> = [];
  public campaigns: Array<Campaign> = [];
  public cardsRoute = AppRoutes.CARDS;
  public currentPage: Page;
  public currentType: CampaignTypes = CampaignTypes.ACTIVE;
  public hasCampaigns: boolean;
  public loaded = false;
  public newCampaignRoute = AppRoutes.NEW_CAMPAIGN_LOCATIONS;
  public type: string;
  public pageTranslations: any;
  public paymentProblemInformation: {
    buttonText: string;
    errorText: string;
    resolveUrl: string;
  } = null;
  public showPaymentProblem: boolean;

  constructor(
    private campaignsService: CampaignsService,
    private filterPipe: FilterPipe,
    private routerService: RouterService,
    private router: Router,
    private searchService: SearchService,
    private translationService: TranslationService,
    private userService: UserService,
    private viewTypeService: ViewTypeService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.translationService
      .getTranslation(['ACTIVE', 'ARCHIVED', 'DRAFT'])
      .subscribe((translations: Array<string>) => {
        this.pageTranslations = {
          0: translations['ACTIVE'],
          1: translations['ARCHIVED'],
          2: translations['DRAFT'],
        };
      });

    this.subscriptions.add(
      this.searchService.type('campaigns').subscribe((term: string) => {
        this.searchTerm = term;
        this.campaigns = this.filterPipe.transform(
          this.allCampaigns,
          'name',
          term
        );
      })
    );

    this.subscriptions.add(
      this.viewTypeService.type('campaigns').subscribe((type: ViewType) => {
        this.type = ViewType[type].toLowerCase();
      })
    );

    this.subscriptions.add(
      this.routerService.$route.subscribe((route: string) => {
        if (route && route.includes('campaigns')) {
          const subroute = route.split('/campaigns')[1].split('?')[0];
          if (subroute === '') {
            this.currentPage = Page.ACTIVE;
            this.currentType = CampaignTypes.ACTIVE;
          } else if (subroute === '/archived') {
            this.currentPage = Page.ARCHIVED;
            this.currentType = CampaignTypes.ARCHIVED;
          } else {
            this.currentPage = Page.DRAFTS;
            this.currentType = CampaignTypes.DRAFT;
          }
        }
      })
    );

    this.subscriptions.add(
      this.campaignsService.$campaignChange.subscribe((change: boolean) => {
        if (change) {
          this.getCampaigns();
        }
      })
    );

    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe((org: Organization) => {
        if (org) {
          this.selectedOrg = org;
          this.getCampaigns();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Determine if there is a billing error or warning and what to show the user
   * @param info
   */
  private determineBillingErrors(info: OrganizationInfo) {
    if (info.funded && !info['prepay-only']) {
      // We have a valid credit card on file.
      this.showPaymentProblem = false;
      this.paymentProblemInformation = null;
    } else if (info.spendable && info.burntime) {
      // User has {{ info.burntime }} days remaining to spend
      this.translationService
        .getTranslation('PAYMENT.PROBLEMS.PREPAY_DAYS_LEFT', {
          days: info.burntime,
        })
        .subscribe((text: string) => {
          this.showPaymentProblem = true;
          this.paymentProblemInformation = {
            buttonText: 'PAYMENT.ADD',
            errorText: text,
            resolveUrl: AppRoutes.CARDS,
          };
        });
    } else if (info.spendable && info.burntime === null) {
      // At least 30 days of burntime remaining.
      this.showPaymentProblem = false;
      this.paymentProblemInformation = null;
    } else if (
      (!info.spendable || info.spendable <= 0) &&
      info['prepay-only']
    ) {
      // There is no prepaid amount and is a prepay only account
      this.translationService
        .getTranslation('PAYMENT.PROBLEMS.POLITICAL_PREPAY_REQUIRED', {
          days: info.burntime,
        })
        .subscribe((text: string) => {
          this.showPaymentProblem = true;
          this.paymentProblemInformation = {
            buttonText: 'PAYMENT.UPDATE_HERE',
            errorText: text,
            resolveUrl: AppRoutes.CARDS,
          };
        });
    } else {
      // There are no cards
      this.translationService
        .getTranslation('PAYMENT.PROBLEMS.NO_CARDS', { days: info.burntime })
        .subscribe((text: string) => {
          this.showPaymentProblem = true;
          this.paymentProblemInformation = {
            buttonText: 'PAYMENT.UPDATE_HERE',
            errorText: text,
            resolveUrl: AppRoutes.CARDS,
          };
        });
    }
  }

  /**
   * Helper function for checklists and stats
   * @param functions
   */
  private reduceCampaignFunctions(
    functions: (() => Promise<Campaign>)[]
  ): Promise<void> {
    return functions.reduce((promise, func) => {
      return promise.then(async () => {
        const campaign = await func();
        const index = this.allCampaigns.findIndex((c) => c.id === campaign.id);
        this.allCampaigns[index] = this.allCampaigns[index].clone(campaign);
        const searchedCampaignsIndex = this.campaigns.findIndex(
          (c) => c.id === campaign.id
        );
        if (searchedCampaignsIndex !== -1) {
          this.campaigns[searchedCampaignsIndex] = campaign;
        }
        return Promise.resolve();
      });
    }, Promise.resolve());
  }

  /**
   * Load the checklist for each campaign
   */
  private loadInformation() {
    const getStatsFunctions = this.allCampaigns.map((campaign: Campaign) => {
      if (!campaign.infoLoaded) {
        return async () => {
          if (
            this.router.url.includes(campaign.categoryType.toString()) ||
            (this.router.url.substr(1).split('?')[0] === 'campaigns' &&
              campaign.categoryType === CampaignTypes.ACTIVE)
          ) {
            try {
              const updatedCampaign = await this.campaignsService.getCampaignStats(
                this.selectedOrg,
                campaign
              );
              return Promise.resolve(
                updatedCampaign.clone({ infoLoaded: true })
              );
            } catch (e) {
              console.error(e);
              this.translationService
                .getTranslation('CAMPAIGNS.ERROR_LOADING_STATS', {
                  campaignName: campaign.name,
                  campaignId: campaign.id,
                })
                .pipe(take(1))
                .subscribe((text: string) => {
                  this.snackBarService.open(text);
                });
              return Promise.resolve(campaign);
            }
          } else {
            return Promise.resolve(campaign);
          }
        };
      } else {
        return async () => {
          const updatedCampaign = campaign.clone({
            notifications: this.campaignsService.setNotifications(campaign),
          });
          return Promise.resolve(updatedCampaign);
        };
      }
    });
    return this.reduceCampaignFunctions(getStatsFunctions);
  }

  /**
   * Get campaigns for the organization based on current page
   * @param type
   */
  private getCampaigns() {
    this.loaded = false;
    this.subscriptions.add(
      this.userService.$selectedOrgInfo
        .pipe(first((val) => val !== null))
        .subscribe((orgInfo: OrganizationInfo) => {
          this.campaigns = [];
          for (let i = 0; i < orgInfo.campaigns[this.currentType]; i++) {
            this.campaigns.push(new Campaign({ thumbnails: [] }));
          }
          const numberOfCampaigns = Object.keys(orgInfo.campaigns || {}).reduce(
            (accumulator, key: string) => {
              return (
                accumulator +
                (orgInfo.campaigns[key] ? orgInfo.campaigns[key] : 0)
              );
            },
            0
          );
          this.hasCampaigns = numberOfCampaigns === 0 ? false : true;
          this.determineBillingErrors(orgInfo);
          this.loaded = true;
          this.campaignsService
            .getCampaignType(this.currentType)
            .then((campaigns: Array<Campaign>) => {
              this.allCampaigns = campaigns.map((campaign) => {
                campaign.categoryType = this.currentType;
                return campaign;
              });
              this.loadInformation();
              const sortedCampaigns = [...this.allCampaigns].sort(
                this.sortCampaigns.bind(this)
              );
              this.campaigns = this.filterPipe.transform(
                sortedCampaigns,
                'name',
                this.searchTerm
              );
            });
        })
    );
  }

  /**
   * Sorts campaigns in this order: Waiting To Launch / Request Approval, Complete Campaign, Enabled, Disabled
   */
  private sortCampaigns(campaignA: Campaign, campaignB: Campaign): number {
    if (this.waitingToLaunch(campaignA)) {
      if (this.waitingToLaunch(campaignB)) {
        return campaignA.name.localeCompare(campaignB.name);
      } else {
        return -1;
      }
    } else if (this.requestApproval(campaignA)) {
      if (this.waitingToLaunch(campaignB)) {
        return 1;
      } else if (this.requestApproval(campaignB)) {
        return campaignA.name.localeCompare(campaignB.name);
      } else {
        return -1;
      }
    } else if (this.completeCampaign(campaignA)) {
      if (this.waitingToLaunch(campaignB) || this.requestApproval(campaignB)) {
        return 1;
      } else if (this.completeCampaign(campaignB)) {
        return campaignA.name.localeCompare(campaignB.name);
      } else {
        return -1;
      }
    } else if (this.enabled(campaignA)) {
      if (
        this.waitingToLaunch(campaignB) ||
        this.completeCampaign(campaignB) ||
        this.requestApproval(campaignB)
      ) {
        return 1;
      } else if (this.enabled(campaignB)) {
        return campaignA.name.localeCompare(campaignB.name);
      } else {
        return -1;
      }
    } else if (this.disabled(campaignA)) {
      if (
        this.waitingToLaunch(campaignB) ||
        this.completeCampaign(campaignB) ||
        this.requestApproval(campaignB) ||
        this.enabled(campaignB)
      ) {
        return 1;
      } else if (this.disabled(campaignB)) {
        return campaignA.name.localeCompare(campaignB.name);
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }

  /**
   * Helper function for sorting campaigns. Determines if campaign is waiting to launch state.
   * @param campaign
   */
  private waitingToLaunch(campaign: Campaign) {
    return campaign.enabled && campaign.underModeration;
  }

  /**
   * Helper function for sorting campaigns. Determines if campaign is in Request Approval state.
   * @param campaign
   */
  private requestApproval(campaign: Campaign) {
    return (
      !campaign.enabled &&
      campaign.canRequestApproval &&
      campaign.underModeration
    );
  }

  /**
   * Helper function for sorting campaigns. Determines if campaign is in an incomplete state.
   * @param campaign
   */
  private completeCampaign(campaign: Campaign) {
    return (
      !campaign.userStepsComplete &&
      !campaign.canRequestApproval &&
      !campaign.underModeration
    );
  }

  /**
   * Helper function for sorting campaigns. Determines if campaign is enabled.
   * @param campaign
   */
  private enabled(campaign: Campaign) {
    return campaign.enabled && campaign.approved && !campaign.underModeration;
  }

  /**
   * Helper function for sorting campaigns. Determines if campaign is disabled.
   * @param campaign
   */
  private disabled(campaign: Campaign) {
    return !campaign.enabled && campaign.approved && !campaign.underModeration;
  }
}
