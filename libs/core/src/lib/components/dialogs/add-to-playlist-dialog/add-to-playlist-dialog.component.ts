import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppRoutes } from '../../../enums';
import { Ad, Playlist } from '../../../models';
import { PlaylistService } from '../../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-add-to-playlist-dialog',
  templateUrl: './add-to-playlist-dialog.component.html',
  styleUrls: ['./add-to-playlist-dialog.component.scss'],
})
export class AddToPlaylistDialogComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private ad: Ad;
  public loading: boolean;
  public newPlaylistRoute = AppRoutes.NEW_PLAYLIST;
  public playlists: Playlist[] = [];
  public selectedPlaylists = new FormControl();

  constructor(
    private playlistService: PlaylistService,
    public dialogRef: MatDialogRef<AddToPlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.ad = this.data.ad;
    this.loading = true;
    this.subscription.add(
      this.playlistService.$playlists.subscribe((playlists: Playlist[]) => {
        this.playlists = playlists.sort(this.sortPlaylists);
        this.loading = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public add(): void {
    this.loading = true;

    const promises: Promise<any>[] = [];
    this.selectedPlaylists.value.forEach((playlist: Playlist) => {
      const newAds: any = [...playlist.ads, this.ad];
      playlist.ads = newAds;
      promises.push(this.playlistService.updatePlaylist(playlist));
    });

    Promise.all(promises)
      .then(() => {
        this.close();
      })
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        this.loading = false;
      });
  }

  public close(): void {
    this.dialogRef.close();
  }

  /**
   * Generic sorting by Playlist name
   * @param p1
   * @param p2
   */
  private sortPlaylists(p1: Playlist, p2: Playlist) {
    if (p1.name.toLowerCase() > p2.name.toLowerCase()) {
      return 1;
    } else if (p1.name.toLowerCase() < p2.name.toLowerCase()) {
      return -1;
    }
    return 0;
  }
}
