import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ad } from '../../models/ad';
import {
  AdsService,
  LoadingService,
  PlaylistService,
  VerificationsService,
} from '../../services';
import {
  FileUploader,
  UploadService,
} from '../../services/upload/upload.service';
import { AddToPlaylistDialogComponent } from '../dialogs/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { ChangeDialogComponent } from '../dialogs/change-dialog/change-dialog.component';
import { UploadQueueDialogComponent } from '../dialogs/upload-queue-dialog/upload-queue-dialog.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-menu',
  templateUrl: './ad-menu.component.html',
  styleUrls: ['./ad-menu.component.scss'],
})
export class AdMenuComponent implements OnInit {
  @Input() ad: Ad;
  @Input() creatingCampaign = false;

  public uploader: FileUploader;

  constructor(
    private adService: AdsService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private playlistService: PlaylistService,
    private uploadService: UploadService,
    private verificationsService: VerificationsService
  ) {}

  async ngOnInit() {
    this.uploader = await this.uploadService.newUploader(this.ad.id);
  }

  /**
   * Bring up add to playlist dialog
   */
  public addToPlaylist() {
    this.dialog.open(AddToPlaylistDialogComponent, {
      minWidth: '24vw',
      maxWidth: '60vw',
      disableClose: true,
      data: { ad: this.ad },
    });
  }

  /**
   * Bring up a delete confirm dialog
   */
  public delete() {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      data: { action: 'DELETE.TEXT', type: 'CHANGE.DELETE_AD' },
    });

    dialogRef.afterClosed().subscribe((deleteAd: boolean) => {
      if (deleteAd) {
        this.adService.deleteAd(this.ad).then((deleted: boolean) => {
          if (deleted) {
            this.refresh();
          }
        });
      }
    });
  }

  /**
   * Emit event for sidenav to read
   */
  public edit(): void {
    this.adService.viewAdDetails(this.ad);
  }

  onFilesAdded(file: File) {
    console.log(`FILE: ${file}`);
    // const files: { [key: string]: File } = this.file.nativeElement.files;
    // for (let key in files) {
    //   if (!isNaN(parseInt(key))) {
    //     this.files.add(files[key]);
    //   }
    // }
  }

  public fileSelected(files: FileList) {
    this.loadingService.setLoading(true);
    const resolutions = this.uploadService.getCurrentResolutions(
      this.ad.images
    );
    this.uploadService
      .prepareFilesForUpload(this.uploader, resolutions)
      .then((conflicts: number) => {
        const dialogRef = this.dialog.open(UploadQueueDialogComponent, {
          minWidth: '50vw',
          maxWidth: '60vw',
          disableClose: true,
          data: {
            name: this.ad.name,
            conflicts: conflicts,
            uploader: this.uploader,
          },
        });

        dialogRef
          .afterClosed()
          .subscribe((obj: { reload?: boolean; adCreated?: Ad } = {}) => {
            if (obj.reload) {
              this.refresh();
            }
          });
      })
      .catch((_) => {})
      .then(() => {
        this.loadingService.setLoading(false);
      });
  }

  /**
   * TODO: Change this to not have to refresh
   */
  private refresh() {
    this.adService.getAds(true);
    this.playlistService.getPlaylists(true);
    this.verificationsService.getVerifications();
  }
}
