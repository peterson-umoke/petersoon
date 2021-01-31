/// <reference types="@types/googlemaps" />

import { DailyCalendarPrices } from './campaign';

// IMPORTANT: Do not remove this line. This is for type support for Google Maps

export interface Points {
  pt1: string;
  pt2: string;
}

export interface SignAnalytics {
  city: string;
  facing?: SignFacing;
  flips: number;
  id: string;
  impressions: number;
  lat: number;
  location: string;
  lon: number;
  name: string;
  province?: string;
  spent: number;
  display_name?: string;
}

export interface SignCluster {
  signs: Array<Sign>;
  lat: string;
  lon: string;
  icon: {
    url: string;
    zIndex: number;
  };
}

export enum SignFacing {
  N = 'N',
  NE = 'NE',
  E = 'E',
  SE = 'SE',
  S = 'S',
  SW = 'SW',
  W = 'W',
  NW = 'NW',
}

export enum SignFilter {
  ALL = 'ALL',
  SELECTED_SIGNS = 'SELECTED_SIGNS',
  AVAILABLE = 'AVAILABLE',
}

export enum SignManufacturers {
  Prismaview = 'Prismaview',
  AdVision = 'AdVision',
  SMInfinity = 'SM Infinity',
  Chainzone = 'Chainzone',
  Watchfire = 'Watchfire',
  Daktronics = 'Daktronics',
  Formetco = 'Formetco',
  MediaResources = 'Media Resources',
  Yesco = 'Yesco',
}

export enum SignPlatform {
  Windows = 0,
  RaspberryPi = 1,
  Other = 999,
}

export interface SignPhoto {
  /**
   * The id of the photo
   */
  id: string;

  /**
   * The url to the photo
   */
  url: string;
}

export enum SignRead {
  R = 'R',
  L = 'L',
  C = 'C',
}

export enum SignSchedulingState {
  /**
   * The scheduler should ignore this sign
   */
  DISABLED = 0,

  /**
   * Scheduler adds everything but Marketplace.
   */
  SLOTS_ONLY = 1,

  /**
   * This sign is fully on. Scheduler adds everything.
   */
  ENABLED = 2,
}

export interface Sign {
  /**
   * Closest road to the given lat lon from Google Geocode
   */
  address?: string;

  /**
   * Is the sign audited
   */
  audited?: boolean;

  /**
   * Average cost per flip for sign (used for A/B testing)
   */
  average_cost_per_flip?: number;

  /**
   * The board height in feet
   */
  board_height?: number;

  /**
   * The board width in feet
   */
  board_width?: number;

  /**
   * Is the sign booked
   */
  booked?: boolean;

  /**
   * The city where the sign is located
   */
  city?: string;

  /**
   * When the sign was created
   */
  created?: number;

  /**
   * Daily impression
   */
  daily_impressions?: string;

  /**
   * Description of the sign
   */
  description?: string;

  /**
   * User friendly display name
   */
  display_name?: string;

  /**
   * Is this sign editable
   */
  editable?: boolean;

  /**
   * What state is the sign in
   */
  enabled?: SignSchedulingState;

  /**
   * What direction this sign is facing
   */
  facing?: SignFacing;

  /**
   * How long is a flip
   */
  flip_duration: number;

  /**
   * What time this sign stops playing and freezes
   */
  freeze_time?: string;

  /**
   * Height in pixels of the screen
   */
  height: number;

  /**
   * The id of the sign
   */
  id?: string;

  /**
   * The latitude of this sign's location
   */
  lat: number;

  /**
   * The url of the feed for this sign
   */
  live_view?: string;

  /**
   * The password to view the live feed
   */
  live_view_password?: string;

  /**
   * The username to view the live feed
   */
  live_view_username?: string;

  /**
   * The longitude of this sign's location
   */
  lon: number;

  /**
   * Friendly location
   */
  location?: string;

  /**
   * The mac address of the sign
   */
  mac_address?: string;

  /**
   * The sign manufacturer
   */
  manufacturer?: SignManufacturers;

  /**
   * The name of this sign
   */
  name: string;

  /**
   * Determines how SlotAssignments are scheduled
   *  true means there are slot assignment
   *  false means they are ordered by number of flips per hour
   */
  ordered: boolean;

  /**
   * The sign owner organization
   */
  organization?: string;

  /**
   * 100 means most impressions per dollar, 0 means least
   */
  percentile?: number;

  /**
   * Photos of the physical sign
   */
  photos?: Array<SignPhoto>;

  postal_code?: string;

  province?: string;

  /**
   * As you drive down the road, does the sign appear on left or right
   */
  read?: SignRead;

  /**
   * What time this sign resumes playing
   */
  thaw_time?: string;

  /**
   * The timezone in which the sign resides
   */
  timezone: string;

  /**
   * The total number of slots on this sign
   * If sign is unordered (i.e. running by flips per hour), this number is 1
   */
  total_slots: number;

  /**
   * Width in pixels of the screen
   */
  width: number;

  /**
   * Is this sign currently selected
   */
  selected?: boolean;

  /**
   * Is this sign currently in view
   */
  inView?: boolean;

  unique_sign?: boolean;

  unique_data?: SignUniqueData;
}

export interface SignSizes {
  height: number;
  quantity: number;
  width: number;
}

export interface SignUniqueData {
  /**
   * The id of the campaign which is a template for this unique sign
   */
  template_campaign_id?: string;

  /**
   * May require specific prices
   */
  prices?: DailyCalendarPrices;
}
