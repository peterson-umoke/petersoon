import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ad, GeneratorTemplate } from '../../../models';
import { AdsService, FileUploader } from '../../../services';

const AD_NAME_MAX = 100;

export interface UploadDialogResult {
  reload?: boolean;
  adCreated?: Ad;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-upload-queue-dialog',
  templateUrl: './upload-queue-dialog.component.html',
  styleUrls: ['./upload-queue-dialog.component.scss'],
})
export class UploadQueueDialogComponent implements OnInit {
  @ViewChild('adName', { static: true }) adNameInput: ElementRef;

  private adCreated: Ad;

  public adForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(AD_NAME_MAX),
    ]),
  });
  public newAd = true;
  public adNameMax = AD_NAME_MAX;
  public generatorTemplate: GeneratorTemplate;
  public uploading = false;

  private functions: Array<{ func: () => void; imageId: string }> = [];

  constructor(
    public dialogRef: MatDialogRef<UploadQueueDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uploader: FileUploader;
      name?: string;
      conflicts?: number;
      replacing?: boolean;
      generatorTemplate?: GeneratorTemplate;
    },
    private adService: AdsService
  ) {
    if (this.data.generatorTemplate) {
      this.generatorTemplate = this.data.generatorTemplate;
    }
  }

  ngOnInit() {
    if (this.data.name) {
      this.adForm.controls.name.setValue(this.data.name);
      this.adForm.controls.name.disable();
      this.newAd = false;
    } else {
      this.adForm.patchValue({
        name: this.data.uploader.files[0].name.slice(0, -4),
      });
    }
  }

  /**
   * Close the dialog and clear the queue
   */
  public close() {
    this.data.uploader.clearQueue();
    this.dialogRef.close({
      reload: false,
    });
  }

  /**
   * Make it easier to select text input
   */
  public editAdName() {
    this.adNameInput.nativeElement.select();
  }

  /**
   * Remove a file from the queue
   * @param file
   */
  public remove(file: File) {
    this.functions = this.functions.filter((functionObj) => {
      return functionObj.imageId !== file['imageId'];
    });

    this.data.uploader.removeFromQueue(file);
    this.data.conflicts--;

    if (this.data.uploader.files.length === 0) {
      this.dialogRef.close();
    }
  }

  /**
   * Create function to delete image and upload a new one on save
   * @param file
   */
  public replace(file: File) {
    this.functions.push({
      func: () => {
        this.adService.deleteImage(file['imageId']);
      },
      imageId: file['imageId'],
    });
    delete file['duplicateSize'];
    this.data.conflicts--;
  }

  /**
   * Save new ad or add images to existing add
   */
  public async save() {
    if (this.newAd) {
      const newAd: Ad = {
        name: this.adForm.controls.name.value,
        generator_template: this.generatorTemplate,
      };

      try {
        const createdAd: Ad = await this.adService.createAd(newAd);
        this.adCreated = createdAd;
        this.data.uploader.adId = createdAd.id;
        await this.upload();
      } catch (err) {
        console.error(`Create Ad Error: ${err}`);
      }
    } else {
      await Promise.all(
        this.functions.map((functionObj) => functionObj.func())
      );
      await this.upload();
    }
  }

  /**
   * Start upload
   */
  private async upload() {
    this.uploading = true;
    this.adForm.controls.name.disable();

    try {
      await this.data.uploader.uploadAll();
    } catch (error) {
      console.error('An error occured in the uploader', error);
    } finally {
      this.data.uploader.clearQueue();
      this.dialogRef.close({
        reload: true,
        adCreated: this.adCreated,
      });
    }
  }
}
