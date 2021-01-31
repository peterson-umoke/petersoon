import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AppRoutes,
  Playlist,
  PlayListImage,
  PlayListRule,
  PlaylistService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

const PLAYLIST_NAME_MAX = 100;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-playlist-details',
  templateUrl: './ad-playlist-details.component.html',
  styleUrls: ['./ad-playlist-details.component.scss'],
})
export class AdPlaylistDetailsComponent implements OnDestroy, OnInit {
  private subs = new Subscription();

  @ViewChild('playlistName', { static: true }) playlistInput: ElementRef;

  public dragDropBag = 'PLAYLISTS';
  public newPlaylist: boolean;
  public playlist: Playlist = {};
  public playlistForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(PLAYLIST_NAME_MAX),
    ]),
  });
  public playlistId: string;
  public playlistNameMax = PLAYLIST_NAME_MAX;
  public playlistRoute = AppRoutes.AD_PLAYLISTS;

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.add(
      this.route.params.subscribe((params) => {
        this.route.queryParamMap
          .subscribe((qparams) => {
            const addCreative = qparams.get('creative') || null;
            const adIndex = +qparams.get('da') || null;

            this.playlistId = params['id'];
            if (this.playlistId) {
              let func = null;
              if (adIndex >= 0) {
                func = () => {
                  this.checkAndCall(adIndex);
                };
              } else if (addCreative) {
                func = () => {
                  this.addCreative();
                };
              }
              this.getPlaylist(func);
              this.newPlaylist = false;
            } else {
              if (!this.playlistForm.controls.name.value) {
                this.playlistForm.patchValue({
                  name: 'New Playlist',
                });
                setTimeout(() => {
                  this.playlistInput.nativeElement.select();
                });
              }

              this.playlist = { ads: [] };
              this.newPlaylist = true;
            }
          })
          .unsubscribe();
      })
    );

    this.subs.add(
      this.playlistService.$playlistAdDelete.subscribe((id: string) => {
        if (id) {
          const ads = [...this.playlist.ads];
          ads.forEach((ad: PlayListImage, index: number) => {
            if (ad.id === id) {
              ads.splice(index, 1);
            }
          });
          this.playlist.ads = ads;
        }
      })
    );
  }

  /**
   * Add artwork to playlist
   */
  public addCreative() {
    this.playlistService.viewAddCreative(true, this.playlist.ads);
  }

  public cancel() {
    this.closeAndNavigate();
  }

  /**
   * When a specific ad is passed into the url,
   * get the ad and open the details section
   * @param adIndex
   */
  public checkAndCall(adIndex: number) {
    // Should be 1 based for user
    const ad =
      this.playlist.ads && this.playlist.ads[adIndex - 1]
        ? this.playlist.ads[adIndex - 1]
        : null;
    this.openDetails(ad, adIndex);
  }

  /**
   * Close playlist add creative sidenav and navigate to playlists
   */
  private closeAndNavigate(): void {
    this.playlistService.closeAddCreative();
    this.router.navigateByUrl(AppRoutes.AD_PLAYLISTS);
  }

  /**
   * Put rules back on playlist for server
   * @param playlist
   */
  private createRulesObject(playlist: Playlist) {
    const rules = [];

    playlist.ads.forEach((ad: PlayListImage, index: number) => {
      if (ad.rules) {
        rules.push({
          rules: ad.rules,
          position: index,
        });
      }
    });

    playlist.rules = rules;
  }

  /**
   * Adds rule object on ads for easier accessibility
   */
  private createRulesOnAds() {
    // Create rules object
    const rules = {};
    this.playlist.rules.forEach((rule: PlayListRule) => {
      rules[rule.position] = rule.rules;
    });

    // Assign rules to each ad
    this.playlist.ads.forEach((ad, index) => {
      if (rules[index]) {
        ad.rules = rules[index];
      }
    });
  }

  /**
   * Drop event outputted by Angular CDK Drag Drop
   * @param event
   */
  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlist.ads, event.previousIndex, event.currentIndex);
  }

  /**
   * Load the requested playlist
   */
  private getPlaylist(func?: () => void) {
    this.playlistService
      .getPlaylist(this.playlistId)
      .then((playlist: Playlist) => {
        this.playlist = playlist;
        this.createRulesOnAds();
        this.playlistForm.controls.name.setValue(this.playlist.name);

        if (func) {
          func();
        }
      });
  }

  /**
   * Open sidenav for ad
   * @param ad
   */
  public openDetails(ad: PlayListImage, index: number) {
    if (ad) {
      ad.index = index;
    }
    this.playlistService.viewPlaylistAdDetails(ad);
  }

  /**
   * Save the playlist in its current state
   */
  public save() {
    const newPlaylist = { ...this.playlist };
    newPlaylist.name = this.playlistForm.controls.name.value;
    this.createRulesObject(newPlaylist);

    if (!this.newPlaylist) {
      this.playlistService.updatePlaylist(newPlaylist).then(() => {
        this.closeAndNavigate();
      });
    } else {
      this.playlistService.createPlaylist(newPlaylist).then(() => {
        this.closeAndNavigate();
      });
    }
  }
}
