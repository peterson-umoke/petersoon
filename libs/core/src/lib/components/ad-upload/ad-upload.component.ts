import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Ad } from '../../models';
import {
  AdsService,
  FileUploader,
  LoadingService,
  SnackBarService,
  TranslationService,
  UploadService,
} from '../../services';
import {
  UploadDialogResult,
  UploadQueueDialogComponent,
} from '../dialogs/upload-queue-dialog/upload-queue-dialog.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-upload',
  templateUrl: './ad-upload.component.html',
  styleUrls: ['./ad-upload.component.scss'],
})
export class AdUploadComponent implements OnInit {
  @Input() uploaderRow = false;
  @Input() fullHeight = false;
  @Input() autoCreateAd = false;
  @Input() ad?: Ad = undefined;
  @Input() restrictResolutionTo?: { width: number; height: number };
  @Input() custom = false;
  @Input() replaceImageId: string;
  @Output() adOutput = new EventEmitter<Ad>();
  public overDropZone = false;
  public uploader: FileUploader;

  constructor(
    private adService: AdsService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private uploadService: UploadService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService
  ) {}

  async ngOnInit() {
    this.uploader = await this.uploadService.newUploader();
  }

  private async uploadToAd(): Promise<void> {
    try {
      await this.uploadService.prepareFilesForUpload(this.uploader);
      await this.validateResolutionAllowed();

      if (this.ad) {
        await this.uploadTo(this.ad); //Upload to existing ad.
      } else {
        await this.createNewAdAndUpload();
      }
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  private async validateResolutionAllowed() {
    if (this.restrictResolutionTo == null) {
      return true;
    }
    this.uploader.files = this.uploader.files.filter(
      (file) =>
        file.width === this.restrictResolutionTo.width &&
        file.height === this.restrictResolutionTo.height
    );
    if (this.uploader.files.length === 0) {
      const errorMessage = await this.translationService
        .getTranslation('ARTWORK_UPLOAD_RESOLUTION_FAILURE', {
          resolution: `${this.restrictResolutionTo.width} x ${this.restrictResolutionTo.height}`,
        })
        .toPromise();
      this.snackBarService.open(errorMessage);
      throw Error('Wrong Resolution');
    }
  }

  private async createNewAdAndUpload() {
    if (!this.autoCreateAd) {
      await this.createNewAdWithDialog();
    } else {
      await this.uploadToNewDefaultAd();
    }
  }

  private async uploadToNewDefaultAd() {
    const dateString = moment().format('MM-DD-YYYY');
    const createdAd = await this.adService.createAd({
      name: `New Ad ${dateString}`,
    });
    this.uploadTo(createdAd);
  }

  private async createNewAdWithDialog() {
    //Don't like that there is duplicated upload code in this dialog
    //Think about refactoring
    const dialogRef = this.dialog.open(UploadQueueDialogComponent, {
      minWidth: '50vw',
      maxWidth: '60vw',
      disableClose: true,
      data: {
        uploader: this.uploader,
      },
    });

    const result: UploadDialogResult = await dialogRef
      .afterClosed()
      .toPromise();
    if (result.reload) {
      this.adService.getAds(true);
      if (result.adCreated) {
        this.adOutput.emit(result.adCreated);
      }
    }
  }

  private async deletePreviousImageIfNecessary(ad: Ad) {
    if (this.replaceImageId != null) {
      await this.adService.deleteImage(this.replaceImageId, ad);
    }
  }

  private async uploadTo(ad: Ad) {
    try {
      await this.deletePreviousImageIfNecessary(ad);
      this.uploader.adId = ad.id;
      await this.uploader.uploadAll();
      this.adOutput.emit(ad);
    } catch (error) {
      console.error('PROBLEM UPLOADING');
    } finally {
      this.uploader.clearQueue();
    }
  }

  /**
   * Handle dropped files and upload
   * @param files
   */
  public uploadDropped(files: Array<File>) {
    this.uploader.files = files;
    return this.uploadToAd();
  }

  /**
   * Handle selected files and upload
   * @param files
   */
  public uploadSelected(files: FileList) {
    this.uploader.setFiles(files);
    return this.uploadToAd();
  }
}
