import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  LoadingService,
  Organization,
  Profile,
  ReportsApiService,
  RequestedReport,
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private reportPaginator: MatPaginator;
  private reportSort: MatSort;

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.reportSort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    mp: MatPaginator
  ) {
    this.reportPaginator = mp;
    this.setDataSourceAttributes();
  }
  public dataSource = new MatTableDataSource<RequestedReport>([]);
  public displayedColumns = [
    'report',
    'description',
    'created',
    'files',
    'actions',
  ];
  public paginatorPageSizes = [5, 10, 25, 50];

  public organization: string;
  public userIsReseller: boolean;
  public reportTypes: Array<{ text: string; value: string }> = [
    { text: 'REPORTS.CAMPAIGN_SPEND.TEXT', value: 'campaignSpend' },
    { text: 'REPORTS.INVOICE.TEXT', value: 'invoice' },
    { text: 'REPORTS.POP.TEXT', value: 'pop' },
  ];
  public selectedReport = this.reportTypes[0].value;

  constructor(
    private loadingService: LoadingService,
    private reportsApiService: ReportsApiService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private userService: UserService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe(
        (organization: Organization) => {
          if (organization) {
            this.organization = organization.id;
            this.getReports();
          }
        }
      )
    );
    this.subscriptions.add(
      this.userService.$profile.subscribe((profile: Profile) => {
        if (profile) {
          this.userIsReseller = profile.user.is_reseller;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public createdReport(reportObject: {
    id?: string;
    success: boolean;
    error?: string;
  }): void {
    if (reportObject.success) {
      this.snackBar();
      this.getReports().then(() => this.getReportComplete(reportObject.id));
    } else {
      this.snackBar(false);
    }
  }

  /**
   * Delete the selected report
   * @param id Report id
   */
  public async deleteReport(id: string) {
    this.loadingService.setLoading(true);
    try {
      await this.reportsApiService.deleteRequestedReport(id);

      // Delete from data source
      const data = [...this.dataSource.data];
      const index = data.findIndex((report: RequestedReport) => {
        return report.id === id;
      });
      data.splice(index, 1);
      this.dataSource.data = data;
      this.translationService
        .getTranslation('REPORTS.SUCCESS.DELETING')
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });
    } catch (error) {
      this.translationService
        .getTranslation('REPORTS.ERROR.DELETING')
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Get requested reports and add to data source
   */
  public async getReports(): Promise<void> {
    this.loadingService.setLoading(true);
    try {
      const resp: {
        pages: number;
        reports: RequestedReport[];
      } = await this.reportsApiService
        .getRequestedReports(this.organization)
        .toPromise();
      this.dataSource = new MatTableDataSource<RequestedReport>([]);
      this.dataSource.data = resp.reports;
      this.dataSource.paginator = this.reportPaginator;
      this.dataSource.sort = this.reportSort;
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    } catch (error) {
      this.snackBar(false);
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  /**
   * Get notified from firebase when report is complete
   * @param reportId
   */
  public getReportComplete(reportId: string) {
    const fsSubject = new Subject();
    this.subscriptions.add(
      this.firestore
        .doc(`reports/${reportId}`)
        .valueChanges()
        .pipe(takeUntil(fsSubject))
        .subscribe((fsReport: Partial<RequestedReport>) => {
          if (fsReport) {
            const index = this.dataSource.data.findIndex(
              (report) => report.id === reportId
            );
            this.dataSource.data[index].pdf_url = fsReport.pdf_url;
            this.dataSource.data[index].csv_url = fsReport.csv_url;
            this.dataSource.data[index].completed = fsReport.completed;
            fsSubject.next();
            fsSubject.complete();
          }
        })
    );
  }

  public openCsv(report: RequestedReport) {
    if (report.completed && report.csv_url) {
      window.location.href = report.csv_url;
    }
  }

  public openPdf(report: RequestedReport) {
    if (report.completed && report.pdf_url) {
      window.open(report.pdf_url, '_blank');
    }
  }

  /**
   * Sets Paginator once dataSource received
   */
  private setDataSourceAttributes() {
    this.dataSource.paginator = this.reportPaginator;
    this.dataSource.sort = this.reportSort;
  }

  /**
   * Show a generic success or failure snack bar
   * @param success Was the call successful or not
   */
  private snackBar(success: boolean = true) {
    const translation = success
      ? 'REPORTS.SUCCESS.CREATING'
      : 'REPORTS.ERROR.CREATING';
    this.translationService
      .getTranslation(translation)
      .subscribe((text: string) => {
        this.snackBarService.open(text);
      });
  }

  /**
   * Override default sorting for Material Table columns
   * @param ad
   * @param sortHeaderId
   */
  private sortingDataAccessor(report: RequestedReport, sortHeaderId: string) {
    if (sortHeaderId === 'report') {
      const detailed =
        report.parameters && report.parameters.detailed
          ? 'Detailed'
          : 'Summary';
      return `${report.type} - ${detailed}`;
    } else if (sortHeaderId === 'description') {
      return `${report.starting} - ${report.ending}`;
    } else if (sortHeaderId === 'created') {
      return report.created;
    } else if (sortHeaderId === 'files') {
      return report.completed ? 1 : 0;
    }
  }
}
