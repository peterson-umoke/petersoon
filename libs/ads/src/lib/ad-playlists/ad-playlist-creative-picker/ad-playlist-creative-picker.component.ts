import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Ad,
  AdsService,
  FilterPipe,
  PlayListImage,
  PlaylistService,
  SnackBarService,
  TranslationService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-playlist-creative-picker',
  templateUrl: './ad-playlist-creative-picker.component.html',
  styleUrls: ['./ad-playlist-creative-picker.component.scss'],
})
export class AdPlaylistCreativePickerComponent implements OnDestroy, OnInit {
  private ads: Ad[];
  private subscriptions = new Subscription();
  private text: string;

  public adsArray: Array<any>;
  public filteredAds: Ad[];
  public search: string;

  constructor(
    private adsService: AdsService,
    private filterPipe: FilterPipe,
    public playlistService: PlaylistService, // CAUTION: Used in HTML
    private snackBarService: SnackBarService,
    private translationService: TranslationService
  ) {
    this.translationService
      .getTranslation('ADDED_TO_PLAYLIST')
      .subscribe((text: string) => {
        this.text = text;
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.playlistService.$playlistAdsArray.subscribe(
        (adsArray: Array<any>) => {
          this.adsArray = adsArray;
        }
      )
    );

    this.subscriptions.add(
      this.adsService.ads$.subscribe((ads: Ad[]) => {
        this.ads = ads;
        this.searchChange();
      })
    );
  }

  public addAd(ad: PlayListImage) {
    const newAd = { ...ad };
    newAd.rules = {};

    this.adsArray.push(newAd);
    this.snackBarService.open(this.text, 2000);
  }

  public close(): void {
    this.playlistService.closeAddCreative();
  }

  public searchChange() {
    this.filteredAds = this.filterPipe
      .transform(this.ads, 'name', this.search)
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
