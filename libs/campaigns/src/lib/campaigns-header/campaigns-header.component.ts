import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppRoutes,
  RouterService,
  SearchService,
  ViewType,
  ViewTypeService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaigns-header',
  templateUrl: './campaigns-header.component.html',
  styleUrls: ['./campaigns-header.component.scss'],
})
export class CampaignsHeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public activeLinkIndex: number;
  public appRoutes = AppRoutes;
  public currentType: string;
  public search: string;
  public newCampaignRoute = AppRoutes.NEW_CAMPAIGN_LOCATIONS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private searchService: SearchService,
    private viewTypeService: ViewTypeService
  ) {}

  ngOnInit() {
    this.viewTypeService
      .type('campaigns')
      .subscribe((type: ViewType) => {
        this.currentType = ViewType[type].toLowerCase();
      })
      .unsubscribe();

    this.subscriptions.add(
      this.routerService.$route.subscribe((route: string) => {
        if (route) {
          this.setActiveLinkIndex(route);
        }
      })
    );

    this.route.queryParamMap
      .subscribe((params) => {
        this.searchService
          .type('campaigns')
          .subscribe((searchTerm: string) => {
            this.search = params.get('search') || searchTerm;
          })
          .unsubscribe();
        this.setSearchServiceTerm(); // Has to be outside of subscribe
        this.setInitialViewType(params.get('view'));
      })
      .unsubscribe();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Change the view type for campaigns
   * @param type
   */
  public changeType(type: string, upadateParams: boolean = true): void {
    if (type === 'card') {
      this.currentType = 'card';
      this.updateViewTypeService(ViewType.CARD);
    } else {
      this.currentType = 'list';
      this.updateViewTypeService(ViewType.LIST);
    }
    if (upadateParams) {
      this.updateQueryParams();
    }
  }

  /**
   * Set search service term on model change
   */
  public searchChange(): void {
    this.setSearchServiceTerm();
    this.updateQueryParams();
  }

  /**
   * Set the active link index based on the activated route
   * @param route
   */
  private setActiveLinkIndex(route: string): void {
    if (route.includes('campaigns')) {
      const subroute = route.split('/campaigns')[1].split('?')[0];
      if (subroute === '') {
        this.activeLinkIndex = 0;
      } else if (subroute === '/archived') {
        this.activeLinkIndex = 1;
      } else {
        this.activeLinkIndex = 2;
      }
    } else if (route.includes('/')) {
      this.activeLinkIndex = 0;
    }
  }

  private setSearchServiceTerm(): void {
    this.searchService.setSearchTerm('campaigns', this.search);
  }

  /**
   * Sets the initial view type
   * @param type
   */
  private setInitialViewType(type: string): void {
    if (type) {
      this.changeType(type, false);
    }
  }

  /**
   * Update the query params in the URL
   * @param type
   */
  private updateQueryParams(): void {
    this.router.navigate([], {
      queryParams: {
        view: this.currentType,
        search: this.search ? this.search : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Update the view type service
   * @param type
   */
  private updateViewTypeService(type: ViewType): void {
    this.viewTypeService.updateType('campaigns', type);
  }
}
