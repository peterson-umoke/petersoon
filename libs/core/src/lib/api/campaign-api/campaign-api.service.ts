import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { CampaignTypes } from '../../enums';
import { ApiResponse, Campaign, Sign } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Get information about what your budget will get you for a Campaign
   * maxPrice
   * dailyBudget
   * signs
   */
  public budgetFeedback(
    maxPrice: number,
    dailyBudget: number,
    signs: Array<Sign>
  ): Observable<any> {
    return this.http
      .get(
        `${this.config.API_URL}/api/displays/budget-feedback`,
        `max_price=${maxPrice}&daily_budget=${dailyBudget}&signs=${signs}`
      )
      .pipe(pluck('result'));
  }

  /**
   * Get the campaigns checklist
   * campaignId
   */
  public checklist(campaignId: string): Observable<any> {
    return this.http
      .get(`${this.config.API_URL}/api/da/campaign_checklist/${campaignId}`)
      .pipe(pluck('result'));
  }

  /**
   * Delete a Campaign
   * campaignId
   */
  public delete(campaignId: string): Observable<ApiResponse> {
    return this.http.delete(
      `${this.config.API_URL}/api/da/campaign/${campaignId}`
    );
  }

  /**
   * Get a Campaign
   * campaignId
   */
  public get(campaignId: string): Observable<Campaign> {
    return this.http
      .get(`${this.config.API_URL}/api/da/campaign/${campaignId}`)
      .pipe(map((response: ApiResponse) => new Campaign(response.result)));
  }

  /**
   * List basic information for campaign type
   * orgId
   * type
   */
  public list(orgId: string, type?: CampaignTypes): Observable<Campaign[]> {
    let url = `${this.config.API_URL}/api/da/campaign/list`;
    if (type) {
      url += `/${type}/`;
    }
    return this.http
      .get(url, `org=${orgId}`)
      .pipe(
        map((response: ApiResponse) =>
          response.result.map((c: Campaign) => new Campaign(c))
        )
      );
  }

  /**
   * Save a new Campaign
   * campaign
   */
  public save(campaign: Campaign): Observable<Campaign> {
    return this.http
      .post(`${this.config.API_URL}/api/da/campaign/`, campaign)
      .pipe(map((response: ApiResponse) => new Campaign(response.result)));
  }

  /**
   * Get Campaign stats for an Organization
   * orgId
   * @param campaignId If provided, get stats for a specific Campaign
   */
  public stats(orgId: string, campaignId?: string): Observable<Campaign> {
    let url = `${this.config.API_URL}/api/da/campaign_stats/${orgId}/`;
    if (campaignId) {
      url += `${campaignId}/`;
    }
    return this.http
      .get(url)
      .pipe(map((response: ApiResponse) => new Campaign(response.result)));
  }

  /**
   * Unarchive a Campaign
   * campaign
   */
  public unarchive(campaign: Campaign): Observable<Campaign> {
    return this.http
      .patch(`${this.config.API_URL}/api/da/campaign/${campaign.id}`, campaign)
      .pipe(map((response: ApiResponse) => new Campaign(response.result)));
  }

  /**
   * Update a Campaign
   * campaign
   */
  public update(campaign: Campaign): Observable<Campaign> {
    return this.http
      .put(`${this.config.API_URL}/api/da/campaign/${campaign.id}`, campaign)
      .pipe(map((response: ApiResponse) => new Campaign(response.result)));
  }
}
