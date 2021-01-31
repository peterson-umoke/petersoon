export interface Report {
  type: PopReport;
}

export interface CampaignSpendReport {
  campaign: string; // Campaign id
  organization: string;
  start_adt?: string;
  end_adt?: string;
}

export interface PopReport {
  instructions: Instructions;
  detailed?: boolean;
  organization: string;
  start_adt?: string;
  end_adt?: string;
}

export interface Instructions {
  ads: Array<string>;
}

export interface RequestedReport {
  id: string;
  created: number;
  organization: RequestedReportOrganization;
  type: 'ProofOfPlay' | 'SignRevenue' | 'ProofOfPlayBySign' | 'CampaignSpend';
  starting: string;
  ending: string;
  completed?: boolean;
  parameters: RequestedReportParameters;
  pdf_url?: string;
  csv_url?: string;
}

export interface RequestedReportOrganization {
  id: string;
  name: string;
}

export interface RequestedReportParameters {
  detailed: boolean;
  advertiser?: string;
  ads: Array<string>;
  daily: boolean;
  sign?: string;
  campaign_code?: string;
  campaign_name?: string;
}
