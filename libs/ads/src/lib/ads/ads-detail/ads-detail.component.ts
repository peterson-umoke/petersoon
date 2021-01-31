import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  Ad,
  AdsService,
  FileUploader,
  SnackBarService,
  TranslationService,
  UploadQueueDialogComponent,
  UploadService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

const AD_NAME_MAX = 100;
const MAX_IMAGES = 4;

@Component({
  selector: 'ads-detail',
  templateUrl: './ads-detail.component.html',
  styleUrls: ['./ads-detail.component.scss'],
})
export class AdsDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Array<Subscription> = [];

  @ViewChild('adName', { static: false }) adName: ElementRef;
  @ViewChild('fileSelect', { static: false }) singleFileSelect: ElementRef;

  public ad: Ad;
  public adForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(AD_NAME_MAX),
    ]),
    selectedSize: new FormControl(0),
  });
  public adNameMax: number = AD_NAME_MAX;
  public editing = false;
  public imageIndex: number;
  public maxImages: number = MAX_IMAGES;
  public uploader: FileUploader;

  constructor(
    private adsService: AdsService,
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private uploadService: UploadService
  ) {}

  async ngOnInit() {
    // Caution: This can be null when there is no ad being viewed
    const adDetails = this.adsService.adDetail$.subscribe(async (ad: Ad) => {
      this.ad = ad;
      this.adForm.controls.name.setValue(ad ? ad.name : '');
      this.adForm.controls.name.disable();
      this.editing = false;
      this.imageIndex = 0;
      this.updateQueryParams(ad ? ad.id : null);
      this.uploader = await this.uploadService.newUploader(ad ? ad.id : null);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  public addSizes(files: FileList): void {
    this.uploader.setFiles(files);
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

        dialogRef.afterClosed().subscribe((_) => {
          this.adsService.viewAdDetails(this.ad.id);
        });
      })
      .catch((_) => {});
  }

  public close(): void {
    this.adsService.viewAdDetails(null);
  }

  public cancelName() {
    this.stopEditing();
  }

  public deleteImage() {
    this.adsService
      .deleteImage(this.ad.images[this.imageIndex].id, this.ad)
      .then(() => {
        if (this.imageIndex > 0 && this.ad.images.length > 0) {
          if (this.imageIndex === this.ad.images.length) {
            this.imageIndex--;
          }
        }
      })
      .catch((err) => {
        console.log('ERROR');
      });
  }

  public editName() {
    this.adForm.controls['name'].enable();
    this.adName.nativeElement.focus();
    this.editing = true;
  }

  public async replaceImage(files: FileList) {
    this.uploader.setFiles(files);
    const resolution = {};
    const image = this.ad.images[this.imageIndex];
    const height = image.height;
    const width = image.width;
    resolution[`${width}.${height}`] = true;

    try {
      const conflicts = await this.uploadService.prepareFilesForUpload(
        this.uploader,
        resolution
      );
      // This uploaded size does not match the currently selected image
      if (!conflicts) {
        this.translationService
          .getTranslation('REPLACING_MISMATCH')
          .subscribe((text: string) => {
            this.snackBarService.open(text);
            this.uploader.clearQueue();
          });
        return;
      }

      const dialogRef = this.dialog.open(UploadQueueDialogComponent, {
        minWidth: '50vw',
        maxWidth: '60vw',
        disableClose: true,
        data: {
          name: this.ad.name,
          uploader: this.uploader,
          replacing: true,
        },
      });

      dialogRef.afterOpened().subscribe(async () => {
        const ad = await this.adsService.deleteImage(image.id, this.ad);

        await this.uploader.uploadAll();
        dialogRef.close(true);
        this.adsService.viewAdDetails(ad.id);
      });
    } catch (error) {
      console.error('UNABLE TO REPLACE IMAGE');
    }
  }

  public saveName() {
    const newName = this.adForm.controls.name.value;
    if (newName !== this.ad.name) {
      const newAd = { ...this.ad };
      newAd.name = newName;
      this.adsService
        .updateAd(newAd)
        .then((savedAd: Ad) => {
          this.ad = savedAd;
        })
        .catch((_) => {})
        .then(() => {
          this.stopEditing();
        });
    } else {
      this.stopEditing();
    }
  }

  private stopEditing(): void {
    this.adForm.controls['name'].disable();
    this.editing = false;
  }

  /**
   * Update the query params in the URL
   * @param ad
   */
  private updateQueryParams(id: string): void {
    this.router.navigate([], {
      queryParams: {
        da: id,
      },
      queryParamsHandling: 'merge',
    });
  }
}
