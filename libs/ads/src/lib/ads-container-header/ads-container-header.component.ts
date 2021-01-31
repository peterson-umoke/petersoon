import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdImage,
  AppRoutes,
  RouterService,
  SearchService,
  VerificationsService,
  ViewType,
  ViewTypeService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ads-container-header',
  templateUrl: './ads-container-header.component.html',
  styleUrls: ['./ads-container-header.component.scss'],
})
export class AdsContainerHeaderComponent implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];

  public activeLinkIndex: number;
  public appRoutes = AppRoutes;
  public currentType: string;
  public hideAll: boolean;
  public search: string;
  public verificationsNeeded = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private searchService: SearchService,
    private verificationsService: VerificationsService,
    private viewTypeService: ViewTypeService
  ) {
    const verifications = this.verificationsService.$verifications.subscribe(
      (images: Array<AdImage>) => {
        this.verificationsNeeded = images.length;
      }
    );

    const viewTypes = this.viewTypeService
      .type('ads')
      .subscribe((type: ViewType) => {
        this.currentType = ViewType[type].toLowerCase();
      });

    this.subscriptions.push(verifications, viewTypes);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    const routes = this.routerService.$route.subscribe((route: string) => {
      if (route) {
        this.setActiveLinkIndex(route);
      }
    });

    const query = this.route.queryParamMap.subscribe((params) => {
      this.searchService
        .type('ads')
        .subscribe((searchTerm: string) => {
          this.search = params.get('search') || searchTerm;
        })
        .unsubscribe();
      this.setSearchServiceTerm(); // Has to be outside of subscribe
      this.setViewType(params.get('view'));
    });

    this.subscriptions.push(routes, query);
  }

  /**
   * Change the view type for ads
   * @param type
   */
  public changeType(type: string, updateParams: boolean = true): void {
    if (type === 'card') {
      this.currentType = 'card';
      this.updateViewTypeService(ViewType.CARD);
    } else {
      this.currentType = 'list';
      this.updateViewTypeService(ViewType.LIST);
    }
    if (updateParams) {
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
    const subroute = route.split('/das')[1].split('?')[0];
    this.hideAll = false;
    if (subroute === '') {
      this.activeLinkIndex = 0;
    } else if (subroute.includes('playlists')) {
      this.activeLinkIndex = 1;
      if (subroute.includes('playlists/')) {
        this.hideAll = true;
      }
    } else {
      this.activeLinkIndex = 2;
    }
  }

  private setSearchServiceTerm(): void {
    this.searchService.setSearchTerm('ads', this.search);
  }

  /**
   * Sets the initial view type
   * @param type
   */
  private setViewType(type: string): void {
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
    this.viewTypeService.updateType('ads', type);
  }
}
