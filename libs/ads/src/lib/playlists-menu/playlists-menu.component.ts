import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  AppRoutes,
  ChangeDialogComponent,
  Playlist,
  PlaylistService,
} from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-playlists-menu',
  templateUrl: './playlists-menu.component.html',
  styleUrls: ['./playlists-menu.component.scss'],
})
export class PlaylistsMenuComponent implements OnInit {
  @Input() playlist: Playlist;

  constructor(
    private dialog: MatDialog,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit() {}

  /**
   * Bring up a delete confirm dialog
   */
  public delete() {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      data: { action: 'DELETE.TEXT', type: 'CHANGE.DELETE_PLAYLIST' },
    });

    dialogRef.afterClosed().subscribe((deleteAd: boolean) => {
      if (deleteAd) {
        this.playlistService.deletePlayList(this.playlist);
      }
    });
  }

  /**
   * Go to edit page for playlist
   */
  public edit() {
    this.router.navigate([AppRoutes.playlistDetails(this.playlist.id)]);
  }
}
