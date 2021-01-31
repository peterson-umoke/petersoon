export enum CampaignRoutes {
  LOCATIONS = 'locations',
  BUDGET = 'budget',
  SCHEDULE = 'schedule',
  ARTWORK = 'artwork',
  GENERATOR = 'generator',
  REVIEW = 'review',
}

// A place to keep all routes that all components/services refer to
export enum AppRoutes {
  // Ads
  ADS = '/das',
  AD_PLAYLISTS = '/das/playlists',
  AD_VERIFICATIONS = '/das/verifications',

  // Campaigns
  CAMPAIGNS = '/campaigns',
  CAMPAIGNS_ARCHIVED = '/campaigns/archived',
  CAMPAIGNS_DRAFTS = '/campaigns/drafts',

  CARDS = '/cards',

  // New Campaign
  NEW_CAMPAIGN_ARTWORK = '/campaigns/new/artwork',
  NEW_CAMPAIGN_GENERATOR = '/campaigns/new/generator',
  NEW_CAMPAIGN_BUDGET = '/campaigns/new/budget',
  NEW_CAMPAIGN_LOCATIONS = '/campaigns/new/locations',
  NEW_CAMPAIGN_REVIEW = '/campaigns/new/review',
  NEW_CAMPAIGN_SCHEDULE = '/campaigns/new/schedule',

  NEW_PLAYLIST = '/das/playlists/new',
  ORGANIZATIONS = '/organizations',
  PAYMENTS = '/payments',
  PREFERENCES = '/preferences',
  REPORTS = '/reports',
  REWARDS = '/rewards',
  USERS = '/users',
  USERS_NEW = '/users/new',

  // Templates
  AD_TEMPLATES = '/da-templates',
  AD_TEMPLATES_NEW = '/da-templates/new',

  // Auth
  CREATE_ORGANIZATION = '/organizations/create',
  LOGIN = '/login',
  REGISTER = '/register',
  REGISTER_SUCCESS = '/register/success',
}

export namespace AppRoutes {
  export function campaignAnalytics(id: string): string {
    return `/campaigns/${id}/analytics`;
  }
  export function campaignDetails(id: string): string {
    return `/campaigns/${id}/details`;
  }
  export function editAdTemplate(id: string): string {
    return `/da-templates/${id}`;
  }
  export function editCampaignRoute(id: string, route: CampaignRoutes) {
    return `/campaigns/edit/${id}/${route}`;
  }
  export function playlistDetails(id: string): string {
    return `/das/playlists/${id}`;
  }
  export function cardDetails(id: string): string {
    return `/cards/${id}`;
  }
  export function userDetails(id: string): string {
    return `/users/${id}`;
  }
  export function newCampaignRoute(route: CampaignRoutes) {
    return `/campaigns/new/${route}`;
  }
}
