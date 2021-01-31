import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdImage, Environment, Resolution } from '../../models';
import { LoadingService } from '../loading/loading.service';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { TranslationService } from '../translation/translation.service';

interface OptionalResolution {
  width?: number;
  height?: number;
}

export class FileUploader {
  public adId = '';

  public files: (File & OptionalResolution)[] = [];

  public isUploading = false;
  public progress = 0;

  constructor(
    private http: HttpClient,
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private environment: Environment,
    private imagesUploadedToAd: Subject<string>
  ) {
    this.files = [];
    this.progress = 0;
  }

  public clearQueue(): void {
    this.files = [];
    this.progress = 0;
  }

  /**
   * Upload a log error to Angular Firestore along with the file in question
   * @param file The file that gave an error
   */
  private async logError(error: string, file: File): Promise<void> {
    const now = new Date();
    const filePath = `uploadErrors/${now.getTime()}`;
    const fileRef = this.afStorage.ref(filePath);
    await this.afStorage.upload(filePath, file);

    const downloadUrl = await fileRef.getDownloadURL().toPromise();
    this.afFirestore.collection('logs').add({
      created: now,
      error: error,
      file: downloadUrl,
    });
  }

  public async removeFromQueue(fileToRemove: File) {
    const index = _.findIndex(this.files, (file) => file === fileToRemove);
    this.files.splice(index, 1);
  }

  public setFiles(files: FileList) {
    const newFiles = [];
    for (let i = 0; i < files.length; i++) {
      newFiles.push(files.item(i));
    }
    this.files = newFiles;
  }

  public async uploadAll(): Promise<void> {
    this.isUploading = true;
    this.progress = 0;
    const url = `${this.environment.API_URL}/api/da/${this.adId}/image/upload`;

    const finished = [];

    for (const file of this.files) {
      // Create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('file_name', file.name);
      formData.append('file_type', file.type);

      try {
        // Angular HttpClient post with FormData automatically sets
        // Content-Type to multipart/form-data and sets the boundary
        await this.http.post(url, formData).toPromise();
        finished.push(0);
        file['progress'] = 100;
        this.progress = Math.round((100 * finished.length) / this.files.length);
        if (finished.length === this.files.length) {
          this.isUploading = false;
          break;
        }
      } catch (error) {
        await this.logError(error.error.errors[0], file);
        this.removeFromQueue(file);
        if (this.files.length === 0) {
          this.isUploading = false;
          break;
        }
      }
    }
    this.imagesUploadedToAd.next(this.adId);
  }
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private imagesUploadedToAd = new Subject<string>();

  public get imagesUploadedToAd$() {
    return this.imagesUploadedToAd.asObservable();
  }

  constructor(
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private loadingService: LoadingService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    private http: HttpClient,
    private environment: Environment
  ) {}

  public async newUploader(adId?: string): Promise<FileUploader> {
    const uploader = new FileUploader(
      this.http,
      this.afFirestore,
      this.afStorage,
      this.environment,
      this.imagesUploadedToAd
    );
    if (adId) {
      uploader.adId = adId;
    }

    return uploader;
  }

  /**
   * Get an object of current resolutions for an ad
   * @param images
   */
  public getCurrentResolutions(
    images: AdImage[]
  ): { [resolution: string]: string } {
    this.loadingService.setLoading(true);
    const resolutions = {};

    images.forEach((image: { height: number; width: number; id: string }) => {
      if (!resolutions[`${image.width}.${image.height}`]) {
        resolutions[`${image.width}.${image.height}`] = image.id;
      }
    });

    this.loadingService.setLoading(false);
    return resolutions;
  }

  public prepareFilesForUpload(
    uploader: FileUploader,
    resolutions?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let conflicts = 0,
        rounds = 0;

      uploader.files.forEach((file: File) => {
        // if (!file.type.includes('png') && !file.type.includes('jpeg')) {
        if (!file.type.includes('image')) {
          uploader.clearQueue();
          this.translationService
            .getTranslation('ONLY_IMAGES')
            .pipe(take(1))
            .subscribe((text: string) => {
              this.snackBarService.open(text, 5000);
              reject();
            });
        }

        this.read(file)
          .then((resolution: Resolution) => {
            rounds++;
            file['height'] = resolution.height;
            file['width'] = resolution.width;

            if (
              resolutions &&
              resolutions[`${resolution.width}.${resolution.height}`]
            ) {
              file['duplicateSize'] = true;
              file['imageId'] =
                resolutions[`${resolution.width}.${resolution.height}`];
              conflicts++;
            }

            if (rounds === uploader.files.length) {
              resolve(conflicts);
            }
          })
          .catch((_err) => {
            uploader.clearQueue();
            reject();
          });
      });
    });
  }

  /**
   * Read a file and return the width and height
   * @param file
   */
  private read(file: File): Promise<Resolution> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (fileEvent) => {
        const image = new Image();
        image.onload = () => {
          resolve({ height: image.height, width: image.width });
        };
        image.src = fileEvent.target['result'] as string;
      };
      reader.onerror = (error) => {
        this.translationService
          .getTranslation('ARTWORK_UPLOAD_FAILURE')
          .subscribe((text: string) => {
            this.snackBarService.open(text, 3000);
            reject();
          });
      };
      reader.readAsDataURL(file);
    });
  }
}
