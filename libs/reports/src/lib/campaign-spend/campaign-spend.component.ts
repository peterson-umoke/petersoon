import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Campaign,
  CampaignApiService,
  CampaignSpendReport,
  LoadingService,
  ReportsApiService,
  RequestedReport,
} from '@marketplace/core';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-spend',
  templateUrl: './campaign-spend.component.html',
  styleUrls: ['./campaign-spend.component.scss'],
})
export class CampaignSpendComponent implements OnInit {
  @Input() organization: string;
  @Output() report: EventEmitter<{
    id?: string;
    success: boolean;
    error?: string;
  }> = new EventEmitter();

  public campaigns: Array<{ id: string; name: string }> = [];
  public campaignSpendForm = new FormGroup({
    campaigns: new FormControl(null, [Validators.required]),
    endDate: new FormControl(moment(), [Validators.required]),
    startDate: new FormControl(moment(), [Validators.required]),
  });

  constructor(
    private campaignApiService: CampaignApiService,
    private loadingService: LoadingService,
    private reportsApiService: ReportsApiService
  ) {}

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.campaignApiService
      .list(this.organization)
      .toPromise()
      .then((campaigns: Array<Campaign>) => {
        this.campaigns = campaigns
          .sort(this.sortCampaigns)
          .map(({ id, name }) => ({ id, name }));
      })
      .catch(() => {
        this.campaigns = [];
      })
      .then(() => {
        this.loadingService.setLoading(false);
      });
  }

  /**
   * Queue up the campaign spend report
   */
  public async createCampaignSpend() {
    this.loadingService.setLoading(true);
    const start = moment(this.campaignSpendForm.value.startDate).format(
      'YYYY-MM-DD'
    );
    const end = moment(this.campaignSpendForm.value.endDate).format(
      'YYYY-MM-DD'
    );
    const campaignSpend: CampaignSpendReport = {
      campaign: this.campaignSpendForm.value.campaigns.id,
      end_adt: end,
      organization: this.organization,
      start_adt: start,
    };

    try {
      const requestedReport: RequestedReport = await this.reportsApiService
        .campaignSpendReport(campaignSpend)
        .toPromise();
      this.report.next({ id: requestedReport.id, success: true });
    } catch (error) {
      this.report.next({ success: false, error: error });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Generic sorting by Campaign name
   * @param c1
   * @param c2
   */
  private sortCampaigns(c1: Campaign, c2: Campaign) {
    if (c1.name.toLowerCase() > c2.name.toLowerCase()) {
      return 1;
    } else if (c1.name.toLowerCase() < c2.name.toLowerCase()) {
      return -1;
    }
    return 0;
  }
}
