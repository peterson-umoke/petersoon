import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  AppRoutes,
  Campaign,
  CampaignRoutes,
  FilterPipe,
  SearchService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent implements OnDestroy, OnInit {
  private searchSubscription: Subscription;

  @Input() campaigns: Array<Campaign>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns = [
    'status',
    'campaign',
    'start_date',
    'end_date',
    'spent',
    'blips',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Campaign>([]);
  public filteredCampaigns: Array<Campaign>;
  public paginatorPageSizes = [10, 25, 50];
  public active: boolean;

  constructor(
    private filterPipe: FilterPipe,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.refreshTableData(10); // The MatTable doesn't re-render when the data source has changed....
    this.active = !(
      this.router.url.includes('drafts') || this.router.url.includes('archived')
    );
    this.searchSubscription = this.searchService
      .type('campaigns')
      .subscribe((term: string) => {
        this.applyFilter(term);
      });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  private refreshTableData(tryLimit: number) {
    let campaignsReady = false;
    if (this.campaigns) {
      const lastIndex = this.campaigns.length - 1;
      if (this.campaigns[lastIndex].checklist) {
        campaignsReady = true;
      } else {
        campaignsReady = false;
      }
    }
    if (campaignsReady || tryLimit <= 0) {
      this.dataSource = new MatTableDataSource<Campaign>(this.campaigns);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.filterPredicate = this.filterPredicate;
    } else {
      setTimeout(() => {
        this.refreshTableData(tryLimit - 1);
      }, 500);
    }
  }

  /**
   * Route to campaign analytics page
   * @param campaign
   */
  public analytics(campaign: Campaign): void {
    this.router.navigate([AppRoutes.campaignAnalytics(campaign.id)]);
  }

  /**
   * Route to campaign edit page
   * @param campaign
   */
  public edit(campaign: Campaign): void {
    this.router.navigate([
      AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.LOCATIONS),
    ]);
  }

  /**
   * Filter Material Table
   * @param filterValue
   */
  private applyFilter(filterValue: string) {
    this.filteredCampaigns = this.filterPipe.transform(
      this.campaigns,
      'name',
      filterValue
    );
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Override default filter for Material Table
   * @param campaign
   * @param filterValue
   */
  private filterPredicate(campaign: Campaign, filterValue: string): boolean {
    return campaign.name.toLowerCase().includes(filterValue);
  }

  /**
   * Show the notifications for the given campaign
   * @param campaign
   */
  public showNotifications(campaign: Campaign) {
    // TODO: What should we do here?
    console.log(`${campaign.name}`);
  }

  /**
   * Override default sorting for Material Table columns
   * @param campaign
   * @param sortHeaderId
   */
  private sortingDataAccessor(campaign: Campaign, sortHeaderId: string) {
    if (sortHeaderId === 'status') {
      // TODO: Add type check here
      // if (campaign.draft) {
      //   return 3;
      // }
      // if (campaign.enabled) {
      //   return 1;
      // }
      return 2;
    } else if (sortHeaderId === 'campaign') {
      return campaign['name'].toLowerCase();
    } else {
      return campaign[sortHeaderId];
    }
  }

  /**
   * Goes to route
   * @param route
   */
  public goToReview(campaign: Campaign) {
    this.router.navigateByUrl(
      AppRoutes.editCampaignRoute(campaign.id, CampaignRoutes.REVIEW)
    );
  }
}
