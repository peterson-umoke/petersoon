import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdsService,
  Organization,
  PlaylistService,
  UserService,
  VerificationsService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ads-container',
  templateUrl: './ads-container.component.html',
  styleUrls: ['./ads-container.component.scss'],
})
export class AdsContainerComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();

  constructor(
    public adsService: AdsService,
    public route: ActivatedRoute,
    public router: Router,
    public playlistService: PlaylistService,
    private userService: UserService,
    public verificationsService: VerificationsService
  ) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe((org: Organization) => {
        if (org) {
          this.adsService.getAds();
          this.playlistService.getPlaylists();
          this.verificationsService.getVerifications();
        }
      })
    );

    this.route.queryParamMap
      .subscribe((params) => {
        if (!this.router.url.includes('playlists')) {
          const adId = params.get('da') || null;
          this.adsService.viewAdDetails(adId);
        }
      })
      .unsubscribe();
  }

  public closed(): void {
    this.adsService.viewAdDetails(null);
    this.playlistService.viewAddCreative(null, null);
    this.playlistService.viewPlaylistAdDetails(null);
  }
}
