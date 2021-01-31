export enum OrgType {
  'BLIP' = 1,
  'OPERATOR' = 2,
  'ADVERTISER' = 3,
  'MARKETPLACE' = 4,
  'AGENCY' = 5,
}

export interface Organization {
  id: string;
  owner: string;
  created: number;
  modified: number;
  name: string;
  category?: string;
  location?: any; // location info retrieved from Google
  type: OrgType;
  allow_tagging?: boolean;
  allow_video?: boolean;
}

export interface OrganizationInfo {
  permissions: Array<string>;
  name: string;
  timezone: string;
  funded: boolean;
  'prepay-only': boolean;
  spendable: number;
  burntime: number;
  campaigns: {
    active: number;
    archived: number;
    draft: number;
    expired: number;
    paused: number;
    pending: number;
    templates: number;
  };
}
