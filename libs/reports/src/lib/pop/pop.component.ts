import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AdApiService,
  LoadingService,
  PopReport,
  PopReportAd,
  ReportsApiService,
  RequestedReport,
} from '@marketplace/core';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
})
export class PopComponent implements OnInit {
  @Input() organization: string;
  @Output() report: EventEmitter<{
    id?: string;
    success: boolean;
    error?: string;
  }> = new EventEmitter();

  public ads: Array<PopReportAd> = [];
  public popForm = new FormGroup({
    ads: new FormControl(null, [Validators.required]),
    detailed: new FormControl(false, [Validators.required]),
    endDate: new FormControl(moment(), [Validators.required]),
    startDate: new FormControl(moment(), [Validators.required]),
  });

  constructor(
    private adApiService: AdApiService,
    private loadingService: LoadingService,
    private reportsApiService: ReportsApiService
  ) {}

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.adApiService
      .getPopReportAds(this.organization)
      .toPromise()
      .then((ads: Array<PopReportAd>) => {
        this.ads = ads.sort(this.sortAds);
      })
      .then(() => {
        this.loadingService.setLoading(false);
      });
  }

  /**
   * Queue up the pop report
   */
  public async createPop() {
    this.loadingService.setLoading(true);
    const adIds = this.popForm.value.ads.map((ad: PopReportAd) => {
      return ad.id;
    });
    const start = moment(this.popForm.value.startDate).format('YYYY-MM-DD');
    const end = moment(this.popForm.value.endDate).format('YYYY-MM-DD');

    const pop: PopReport = {
      detailed: this.popForm.value.detailed,
      end_adt: end,
      instructions: { ads: adIds },
      organization: this.organization,
      start_adt: start,
    };

    try {
      const requestedReport: RequestedReport = await this.reportsApiService
        .popReport(pop)
        .toPromise();
      this.report.next({ id: requestedReport.id, success: true });
    } catch (error) {
      this.report.next({ success: false, error: error });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Generic sorting by Ad name
   * @param ad1
   * @param ad2
   */
  private sortAds(ad1: PopReportAd, ad2: PopReportAd) {
    if (ad1.name.toLowerCase() > ad2.name.toLowerCase()) {
      return 1;
    } else if (ad1.name.toLowerCase() < ad2.name.toLowerCase()) {
      return -1;
    }
    return 0;
  }
}
