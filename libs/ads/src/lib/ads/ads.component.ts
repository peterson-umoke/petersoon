import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Ad,
  AdsService,
  FilterPipe,
  SearchService,
  ViewType,
  ViewTypeService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnDestroy, OnInit {
  private subscription: Subscription = new Subscription();
  private searchTerm: string;

  public ads: Ad[];
  public allAds: Ad[];
  public viewType: string;

  constructor(
    public adsService: AdsService,
    public filterPipe: FilterPipe,
    public searchService: SearchService,
    public viewTypeService: ViewTypeService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.viewTypeService.type('ads').subscribe((type: ViewType) => {
        this.viewType = ViewType[type].toLowerCase();
      })
    );

    this.subscription.add(
      this.adsService.ads$.subscribe((ads: Ad[]) => {
        this.allAds = ads;
        this.ads = this.allAds.sort(this.sortAds);
        this.filterAds();
      })
    );

    this.subscription.add(
      this.searchService.type('ads').subscribe((searchTerm: string) => {
        this.searchTerm = searchTerm;
        this.filterAds();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public adClicked(ad: Ad) {
    this.adsService.viewAdDetails(ad);
  }

  /**
   * Filter ads on search term and then sort them
   */
  private filterAds(): void {
    this.ads = this.filterPipe
      .transform(this.allAds, 'name', this.searchTerm)
      .sort(this.sortAds);
  }

  /**
   * Generic sorting by Ad name
   * @param ad1
   * @param ad2
   */
  private sortAds(ad1: Ad, ad2: Ad) {
    if (ad1.name.toLowerCase() > ad2.name.toLowerCase()) {
      return 1;
    } else if (ad1.name.toLowerCase() < ad2.name.toLowerCase()) {
      return -1;
    }
    return 0;
  }
}
