import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PlaylistApiService } from '../../../api';
import { Playlist, PlayListImage } from '../../../models';
import { LoadingService } from '../../loading/loading.service';
import { SnackBarService } from '../../snack-bar/snack-bar.service';
import { TranslationService } from '../../translation/translation.service';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private playlistAddCreative: Subject<boolean> = new Subject<boolean>();
  private playlistAdsArray: Subject<Array<any>> = new Subject<Array<any>>();
  private playlistAdDelete: Subject<string> = new Subject<string>();
  private playlistDetail: Subject<PlayListImage> = new Subject<PlayListImage>();
  private playlists: BehaviorSubject<Playlist[]> = new BehaviorSubject<
    Playlist[]
  >([]);
  private subscriptions: Subscription = new Subscription();
  private translations = { playlist: '', playlists: '' };

  public $loaded: Observable<boolean> = this.loaded.asObservable();
  public $playlistAddCreative: Observable<
    boolean
  > = this.playlistAddCreative.asObservable();
  public $playlistAdsArray: Observable<
    Array<any>
  > = this.playlistAdsArray.asObservable();
  public $playlistAdDelete: Observable<
    string
  > = this.playlistAdDelete.asObservable();
  public $playlistDetail: Observable<
    PlayListImage
  > = this.playlistDetail.asObservable();
  public $playlists: Observable<Playlist[]> = this.playlists.asObservable();

  constructor(
    private loadingService: LoadingService,
    private playlistApiService: PlaylistApiService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private userService: UserService
  ) {
    this.translationService
      .getTranslation(['PLAYLIST', 'PLAYLISTS.TEXT'])
      .subscribe((text: Array<string>) => {
        this.translations.playlist = text['PLAYLIST'].toLowerCase();
        this.translations.playlists = text['PLAYLISTS.TEXT'].toLowerCase();
      });

    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe(() => {
        this.reset();
      })
    );
  }

  /**
   * Close add creative side panel
   */
  public closeAddCreative() {
    this.playlistAddCreative.next(false);
  }

  /**
   * Create a new playlist
   * @param playlist
   */
  public createPlaylist(playlist: Playlist) {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.playlistApiService
        .createPlaylist(this.userService.organization.id, playlist)
        .toPromise()
        .then((newPlaylist: Playlist) => {
          const newPlaylists = [...this.playlists.value, newPlaylist];
          this.playlists.next(newPlaylists);
          this.translationService
            .getTranslation('SUCCESS.SAVING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(newPlaylist);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.SAVING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  /**
   * Delete playlist
   * @param playlist
   */
  public deletePlayList(playlist: Playlist): Promise<any> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.playlistApiService
        .deletePlaylist(playlist.id)
        .toPromise()
        .then(() => {
          const newPlaylists = this.playlists.value.filter(
            (currPlaylist: Playlist) => {
              return playlist.id !== currPlaylist.id;
            }
          );
          this.translationService
            .getTranslation('SUCCESS.DELETING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          this.playlists.next(newPlaylists);
          resolve();
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.DELETING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  /**
   * Get an individual playlist
   * @param id
   */
  public getPlaylist(id: string): Promise<Playlist> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.playlistApiService
        .getPlaylist(id)
        .toPromise()
        .then((playlist: Playlist) => {
          const newPlaylists = [...this.playlists.value];
          let exists = false;
          newPlaylists.forEach((curPlay: Playlist, index: number) => {
            if (curPlay.id === playlist.id) {
              newPlaylists.splice(index, 1, playlist);
              exists = true;
              return;
            }
          });
          if (!exists) {
            newPlaylists.push(playlist);
          }
          this.playlists.next(newPlaylists);
          resolve(playlist);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.LOADING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  /**
   * Get all playlists
   * @param force
   */
  public getPlaylists(force: boolean = false): void {
    this.loaded.next(false);
    if (!this.playlists.value.length || force) {
      this.loadingService.setLoading(true);
      this.playlistApiService
        .allPlaylists(this.userService.organization.id)
        .toPromise()
        .then((playlists: Playlist[]) => {
          this.playlists.next(playlists);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.LOADING', {
              type: this.translations.playlists,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        })
        .then(() => {
          this.loaded.next(true);
          this.loadingService.setLoading(false);
        });
    } else {
      this.loaded.next(true);
      this.playlists.next(this.playlists.value);
    }
  }

  /**
   * Reset all values
   */
  public reset() {
    this.loaded.next(false);
    this.playlistAddCreative.next(false);
    this.playlistAdsArray.next([]);
    this.playlistAdDelete.next('');
    this.playlistDetail.next(null);
    this.playlists.next([]);
  }

  public updatePlaylist(playlist: Playlist): Promise<any> {
    return new Promise((resolve) => {
      this.loadingService.setLoading(true);
      this.playlistApiService
        .updatePlaylist(playlist)
        .toPromise()
        .then((updatedPlaylist: Playlist) => {
          const newPlaylists = [...this.playlists.value];
          newPlaylists.forEach((curPlay: Playlist, index: number) => {
            if (curPlay.id === updatedPlaylist.id) {
              newPlaylists.splice(index, 1, updatedPlaylist);
              return;
            }
          });
          this.playlists.next(newPlaylists);
          this.translationService
            .getTranslation('SUCCESS.UPDATING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve(updatedPlaylist);
        })
        .catch((err) => {
          this.translationService
            .getTranslation('ERROR.UPDATING', {
              type: this.translations.playlist,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          resolve();
        })
        .then(() => {
          this.loadingService.setLoading(false);
        });
    });
  }

  /**
   * Remove an ad from a playlist
   * @param id ID of the ad to be deleted from the playlist
   */
  public viewPlaylistAdDelete(id: string) {
    this.playlistAdDelete.next(id);
  }

  /**
   * Open and view add creative to playlist
   * @param open
   */
  public viewAddCreative(add: boolean, adsArray: Array<any>): void {
    setTimeout(() => {
      this.playlistAddCreative.next(add);
      this.playlistAdsArray.next(adsArray);
    });
  }

  /**
   * View Playlist ad details
   * @param playlist
   */
  public viewPlaylistAdDetails(playlist: PlayListImage): void {
    this.playlistDetail.next(playlist);
  }
}
