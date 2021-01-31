export enum OrganizationType {
  BLIP = 1, // Master org, responsible for self-promo ads and system campaign templates
  OPERATOR = 2, // Sign operator
  ADVERTISER = 3, // Customer of a sign operator or agency
  MARKETPLACE = 4, // Marketplace self-service customer
  AGENCY = 5, // Advertising agency, coordinating multiple advertisers
}

export enum OrganizationTypeString {
  BLIP = 'BLIP', // Master org, responsible for self-promo ads and system campaign templates
  OPERATOR = 'OPERATOR', // Sign operator
  ADVERTISER = 'ADVERTISER', // Customer of a sign operator or agency
  MARKETPLACE = 'MARKETPLACE', // Marketplace self-service customer
  AGENCY = 'AGENCY', // Advertising agency, coordinating multiple advertisers
}

export interface Profile {
  user: User;
  organizations: Array<Organization>;
}

export interface User {
  email: string;
  email_verified: string;
  first_name: string;
  id: string;
  is_reseller: boolean;
  is_superuser: boolean;
  last_name: string;
  phone: string;
  terms_accepted: string | boolean;
  timezone: string;
  preferences: UserPreference;
}

export interface UserPreference {
  currency?: string;
  language?: string;
}

export interface NotificationFrequency {
  id: string;
  last_send?: string;
  frequency_options: Array<
    'NEVER' | 'ONCE' | 'ON_CHANGE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  >;
  friendly_name:
    | 'Image Moderation Updates'
    | 'Campaign Debuts'
    | 'Campaign Reports'
    | 'Limited Availability';
  send_frequency:
    | 'NEVER'
    | 'ONCE'
    | 'ON_CHANGE'
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY';
  description: string;
}

export interface Organization {
  id: string;
  owner: string;
  created: number;
  modified: number;
  name: string;
  type: OrganizationType | OrganizationTypeString;
  category?: string;
  location?: google.maps.places.PlaceResult | string;
}

export interface OrganizationInfo {
  'card-limit': number;
  funded: boolean;
  name: string;
  permissions: string[];
  'prepay-only': boolean;
  spendable: number;
  timezone: string;
  burntime?: number;
  campaigns?: object;
}
