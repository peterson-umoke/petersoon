import { CampaignTypes } from '../enums';
import { Ad } from './ad';
import { Sign, SignAnalytics } from './sign';

export enum CampaignType {
  STANDARD = 'STANDARD',
  PRESOLD = 'PRESOLD',
  AMBER_ALERT = 'AMBER_ALERT',
  SELF_PROMOTION = 'SELF_PROMOTION',
  SYSTEM_TEMPLATE = 'SYSTEM_TEMPLATE',
  USER_TEMPLATE = 'USER_TEMPLATE',
}

export class Campaign {
  // Basic Information
  'campaign_type': CampaignType = CampaignType.STANDARD;
  name = 'New Campaign';
  categoryType?: CampaignTypes;
  'daily_budget'?: number;
  'deleted'?: boolean;
  description = ''; // Not provided by user anymore but required by backend
  enabled?: boolean;
  'end_date'?: string;
  id?: string;
  'max_price'?: number;
  'start_date'?: string;
  thumbnails?: string[];
  timezone?: string;
  // Basic Information
  'ad_group'?: { ads: Array<any> };
  billboards?: number;
  blips?: number;
  checklist?: CampaignChecklist;
  conflict?: boolean;
  daily?: Array<{ blips: number; day: string; spent: number }>;
  editable?: boolean;
  'first_shown'?: string;
  hidden?: boolean;
  impressions?: number;
  infoLoaded?: boolean;
  'last_shown'?: string;
  modified?: boolean;
  // Array of keys to translation file
  notifications?: Array<{
    key: string;
    params: { linkText?: string; linkFunction?: () => void };
  }>;
  organization?: string;
  'rule_group'?: CampaignRuleGroup;
  spent?: number;
  'show_play_pause'?: boolean;
  signs?: SignAnalytics[];
  'sign_count'?: number;
  'sign_group'?: SignGroup;
  status?: string;
  'yesterday_blips'?: number;
  'week_blips'?: number;

  public constructor(props?: Partial<Campaign>) {
    Object.assign(this, props);
  }

  public clone(changes?: {}) {
    return Object.assign(new Campaign(this), changes);
  }

  get artworkSet(): boolean {
    return (this.ad_group && this.ad_group.ads && this.ad_group.ads.length) ||
      (this.thumbnails && this.thumbnails.length > 0)
      ? true
      : false;
  }

  get budgetSet(): boolean {
    return this.daily_budget && this.daily_budget > 0 ? true : false;
  }

  get locationsSet(): boolean {
    return (this.sign_group &&
      this.sign_group.signs &&
      this.sign_group.signs.length) ||
      this.sign_count > 0
      ? true
      : false;
  }

  // User must be billable
  get canRequestApproval(): boolean {
    return (
      this.name &&
      this.artworkSet &&
      this.budgetSet &&
      this.locationsSet &&
      this.scheduleSet
    );
  }

  get userStepsComplete(): boolean {
    return (
      this.canRequestApproval &&
      this.checklist &&
      this.checklist.org_has_daily_spend
    );
  }

  get underModeration(): boolean {
    return (
      this.userStepsComplete &&
      this.checklist &&
      this.checklist.signs_with_modded_images.length < 1
    );
  }

  get allAdsRejected(): boolean {
    return (
      (this.checklist &&
        this.checklist.signs_with_rejected_images.length > 0 &&
        this.checklist.signs_awaiting_modding.length === 0) ||
      (this.checklist &&
        this.checklist.signs_with_images.length < 1 &&
        Object.keys(this.checklist.signs_without_images).length > 0)
    );
  }

  get scheduleSet(): boolean {
    // New Campaign
    if (this.rule_group && this.rule_group.rules) {
      const dailyCalendar = this.rule_group.rules.find((rule: CampaignRule) => {
        return rule.type === 'DailyCalendar';
      });
      if (
        // Schedule completely empty
        dailyCalendar &&
        dailyCalendar.data.length === 1 &&
        dailyCalendar.data[0].days.length === 7 &&
        dailyCalendar.data[0].price_times[0][0] === 0 &&
        dailyCalendar.data[0].price_times[0][1] === 0 &&
        dailyCalendar.data[0].price_times[1][0] === 1440 &&
        dailyCalendar.data[0].price_times[1][1] === 0
      ) {
        return false;
      } else if (dailyCalendar) {
        // Schedule has been initialized and is not empty
        return true;
      }
    }
    // No schedule has been set for existing campaign
    return false;
  }

  get approved(): boolean {
    return (
      this.userStepsComplete &&
      this.checklist &&
      this.checklist.signs_with_modded_images.length > 0
    );
  }

  get someApproved(): boolean {
    return (
      this.checklist &&
      this.checklist.signs_with_modded_images.length > 0 &&
      this.checklist.signs_awaiting_modding.length > 0
    );
  }

  get someRejected(): boolean {
    return (
      this.checklist &&
      this.checklist.signs_awaiting_modding.length > 0 &&
      this.checklist.signs_with_rejected_images.length > 0
    );
  }

  get allRejected(): boolean {
    return (
      this.checklist &&
      this.checklist.signs_with_rejected_images.length > 0 &&
      this.checklist.signs_awaiting_modding.length < 1 &&
      this.checklist.signs_with_modded_images.length < 1
    );
  }
}

export interface CampaignAdGroup {
  ads: Array<Ad>;
}

export interface CampaignRuleGroup {
  rules: Array<CampaignRule>;
}

export interface DailyCalendarPrices {
  low?: string;
  medium?: string;
  high?: string;
}

export interface CampaignRule {
  type: 'DailyCalendar';
  data?: DailyCalendarData[];
  prices?: DailyCalendarPrices;
}

export interface SignGroup {
  id?: string;
  created?: number;
  modified?: number;
  name?: string;
  signs: Array<string>;
  auto_include: boolean;
  type?: 'CAMPAIGN';
  organization?: string;
}

export interface NewSignGroup {
  auto_include: boolean;
  signs: Array<string>;
}

export interface CampaignChecklist {
  pending_verifications: boolean;
  org_has_daily_spend: boolean;
  campaign_enabled: boolean;
  signs_with_rejected_images: Array<object>;
  rules_allow_current_showing: boolean;
  signs_with_images: Array<string>;
  signs_with_all_ad_rules_off: Array<string>;
  campaign_has_started: boolean;
  signs_awaiting_modding: Array<string>;
  all_signs_disabled: boolean;
  all_signs_unavailable: boolean;
  signs_with_modded_images: Array<{ id: string; name: string }>;
  campaign_has_ended: boolean;
  has_signs_without_images: boolean;
  signs_without_images: {
    [signWidthHeight: string]: {
      width: number;
      height: number;
      signs: Array<Sign['id']>;
    };
  };
}

export interface DailyCalendarData {
  days?: Array<number>;
  price_times?: Array<[number, number]>; // [minute, price]
}
