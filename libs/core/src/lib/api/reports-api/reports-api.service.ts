import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import {
  ApiResponse,
  CampaignSpendReport,
  PopReport,
  RequestedReport,
} from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Request a Campaign Spend report be generated
   * @param report CampaignSpendReport fields required for generation
   */
  public campaignSpendReport(
    report: CampaignSpendReport
  ): Observable<RequestedReport> {
    return this.http
      .post(`${this.config.API_URL}/api/report/campaign-spend/`, report)
      .pipe(pluck('result'));
  }

  /**
   * Delete a requested report
   * @param reportId Report to be deleted
   */
  public deleteRequestedReport(reportId: string): Observable<ApiResponse> {
    return this.http.delete(
      `${this.config.API_URL}/api/report/requested/${reportId}/`
    );
  }

  /**
   * Get all requested reports for the organization
   * @param orgId Organization id for ads to get
   */
  public getRequestedReports(
    orgId: string,
    page: number = 1
  ): Observable<{ pages: number; reports: Array<RequestedReport> }> {
    return this.http
      .get(
        `${this.config.API_URL}/api/report/requested`,
        `org=${orgId}&page=${page}`
      )
      .pipe(
        map((response: ApiResponse) => {
          return {
            pages: response.meta.page_count,
            reports: response.result,
          };
        })
      );
  }

  /**
   * Request a POP report to be generated
   * @param report PopReport fields required for report generation
   */
  public popReport(report: PopReport): Observable<RequestedReport> {
    return this.http
      .post(`${this.config.API_URL}/api/report/pop/`, report)
      .pipe(pluck('result'));
  }

  /**
   * Open the invoice report
   * @param orgId The organization the report is to be run for
   * @param month The month. Should be in format `03`
   * @param year The year. Should be in format `2019`
   */
  public invoiceReport(orgId: string, month: string, year: string): void {
    window.open(
      `${this.config.API_URL}/api/account/${orgId}/invoice-${year}-${month}.pdf`,
      '_blank'
    );
  }
}
