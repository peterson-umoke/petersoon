import { Injectable, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  Ad,
  AdsService,
  Environment,
  FileUploader,
  GeneratorTemplate,
  HttpService,
  ProgressSpinnerComponent,
  SnackBarService,
  TranslationService,
  UploadQueueDialogComponent,
  UploadService,
  UserService,
} from '@marketplace/core';
import * as loadImage from 'blueimp-load-image';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  filter,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

export interface GenAdSize {
  width: number;
  height: number;
}

const _genAdSizes = [
  {
    width: 1920,
    height: 1005,
  },
  {
    width: 1920,
    height: 1123,
  },
  {
    width: 1840,
    height: 536,
  },
  {
    width: 1800,
    height: 476,
  },
  {
    width: 1536,
    height: 364,
  },
  {
    width: 1280,
    height: 837,
  },
  {
    width: 1220,
    height: 578,
  },
  {
    width: 1152,
    height: 403,
  },
  {
    width: 1080,
    height: 1920,
  },
  {
    width: 928,
    height: 144,
  },
  {
    width: 896,
    height: 349,
  },
  {
    width: 896,
    height: 830,
  },
  {
    width: 896,
    height: 933,
  },
  {
    width: 864,
    height: 371,
  },
  {
    width: 844,
    height: 1260,
  },
  {
    width: 674,
    height: 126,
  },
  {
    width: 525,
    height: 640,
  },
  {
    width: 400,
    height: 328,
  },
  {
    width: 252,
    height: 864,
  },
  {
    width: 208,
    height: 432,
  },
];

export const PRESET_COLORS = [
  '#ffffff',
  '#000000',
  '#1c3144',
  '#f75c03',
  '#faea25',
  '#bae8ba',
  '#1ba0f4',
  '#b146ff',
  '#37e852',
  '#2274a5',
  '#ffac93',
  '#e5a100',
  '#c4cfff',
  '#ffbef5',
  '#77005b',
  '#fadf7f',
  '#ad2831',
];

declare var window: any;

export type GenFont =
  | 'Arbutus Slab'
  | 'Baloo Da'
  | 'Barlow'
  | 'Exo'
  | 'Lato'
  | 'Merriweather'
  | 'Montserrat'
  | 'Oswald';

export interface GeneratorColorPair {
  background: string;
  fontColor: string;
}

export class GeneratorInfo {
  public primary: GeneratorColorPair = {
    background: '#000000',
    fontColor: '#ffffff',
  };
  public secondary: GeneratorColorPair = {
    background: '#ffffff',
    fontColor: '#000000',
  };
  public third?: string;
  public subhead?: string;
  public font: GenFont = 'Lato';
  public imageURL?: string | ArrayBuffer;
  public headline?: string;

  public constructor(props?: Partial<GeneratorInfo>) {
    Object.assign(this, props);
  }

  public clone(changes?: Partial<GeneratorInfo>) {
    return Object.assign(new GeneratorInfo(this), changes);
  }
}

@Injectable()
export class ArtworkGeneratorService {
  private destroy$: Subject<boolean> = new Subject();
  public savedAd$: Subject<Ad> = new Subject();
  private maxImageSize = 5242880;
  private uploader: FileUploader;
  private spinnerRef: MatDialogRef<ProgressSpinnerComponent>;
  private files: Array<File> = [];
  private generatorInfoSubject = new BehaviorSubject(new GeneratorInfo());
  private selectedTemplateSubject = new BehaviorSubject(
    GeneratorTemplate.BASIC
  );
  private templatesWithoutThird = [
    GeneratorTemplate.SPLIT,
    GeneratorTemplate.SPLIT_INVERT,
  ];

  public generatorInfo$ = this.generatorInfoSubject.asObservable();
  public selectedTemplate$ = this.selectedTemplateSubject.asObservable();
  public generatorForm: FormGroup;
  private showSizes: BehaviorSubject<boolean[]> = new BehaviorSubject([]);
  public showSizes$ = this.showSizes.asObservable();
  public genAdSizes: GenAdSize[];
  public thirdMax = 100;
  public subheadMax = 100;
  public showPreviewOverlay = true;
  public headlineMax = 100;
  private charCount: BehaviorSubject<number> = new BehaviorSubject(0);
  public charCount$ = this.charCount.asObservable();
  public characterLimit = 60;
  private rendering: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public rendering$ = this.rendering.asObservable();
  private getStyles$: Observable<string>;

  constructor(
    private uploadService: UploadService,
    private translationService: TranslationService,
    private snackBarService: SnackBarService,
    private adsService: AdsService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private http: HttpService,
    private environment: Environment,
    private userService: UserService
  ) {
    this.genAdSizes = _genAdSizes;

    this.generatorForm = new FormGroup({
      headline: new FormControl(null, [Validators.maxLength(this.headlineMax)]),
      subhead: new FormControl(null, [Validators.maxLength(this.subheadMax)]),
      third: new FormControl(null, [Validators.maxLength(this.thirdMax)]),
    });

    this.updateShowSizes(false);

    this.initializeUploader();

    this.generatorForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (changes: { headline: string; subhead: string; third: string }) => {
          this.updateText(changes);
        }
      );

    this.userService.$selectedOrganization
      .pipe(
        filter((org) => org !== null),
        take(1)
      )
      .subscribe((org) => {
        this.generatorInfoSubject.next(
          this.generatorInfoSubject.value.clone({ headline: org.name })
        );
        this.generatorForm.controls['headline'].setValue(org.name);
      });

    this.selectedTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selected) => {
        this.computeCharacterCount();
        if (this.templatesWithoutThird.includes(selected)) {
          this.generatorForm.get('third').disable({ onlySelf: true });
        } else {
          this.generatorForm.get('third').enable({ onlySelf: true });
        }
      });
  }

  private async initializeUploader(): Promise<void> {
    this.uploader = await this.uploadService.newUploader();
  }

  public get primary() {
    return this.generatorInfoSubject.value.primary;
  }

  public get secondary() {
    return this.generatorInfoSubject.value.secondary;
  }

  public updateColor(color: string): void {
    const rgbColor = this.hexToRgb(color);
    const contrastWithWhite = this.contrast(rgbColor, [255, 255, 255]);
    const contrastWithBlack = this.contrast(rgbColor, [0, 0, 0]);
    const fontColor =
      contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#000000';
    this.generatorInfoSubject.next(
      this.generatorInfoSubject.value.clone({
        primary: {
          background: color,
          fontColor: fontColor,
        },
      })
    );
  }

  public updateFont(font: GenFont): void {
    this.generatorInfoSubject.next(
      this.generatorInfoSubject.value.clone({ font })
    );
  }

  public updateImageURL(url: string | ArrayBuffer) {
    this.generatorInfoSubject.next(
      this.generatorInfoSubject.value.clone({
        imageURL: url,
      })
    );
    this.computeCharacterCount();
  }

  public updateSelectedTemplate(updatedSelectedTemplate: GeneratorTemplate) {
    this.selectedTemplateSubject.next(updatedSelectedTemplate);
  }

  public updateText(changes: {
    headline: string;
    subhead: string;
    third: string;
  }): void {
    this.generatorInfoSubject.next(
      this.generatorInfoSubject.value.clone(changes)
    );
    this.computeCharacterCount();
  }

  /**
   * https://stackoverflow.com/a/9733420/7201985
   */
  private contrast(rgb1: Array<number>, rgb2: Array<number>): number {
    const result =
      (this.luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) /
      (this.luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
    return result < 1 ? 1 / result : result;
  }

  /**
   * https://stackoverflow.com/a/5624139/7201985
   */
  private hexToRgb(hex: string): Array<number> {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16), // r
          parseInt(result[2], 16), // g
          parseInt(result[3], 16), // b
        ]
      : [];
  }

  /**
   * https://stackoverflow.com/a/9733420/7201985
   */
  private luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  private computeCharacterCount() {
    // There's probably a better solution than hard coding the default text here
    const headlineLength =
      this.generatorInfoSubject.value.headline != null
        ? this.generatorInfoSubject.value.headline.length
        : 'Headline'.length;
    const subheadLength =
      this.generatorInfoSubject.value.subhead != null
        ? this.generatorInfoSubject.value.subhead.length
        : 'Subhead'.length;
    let thirdLength =
      this.generatorInfoSubject.value.third != null
        ? this.generatorInfoSubject.value.third.length
        : '3rd text field'.length;
    if (
      this.templatesWithoutThird.includes(this.selectedTemplateSubject.value) ||
      this.generatorInfoSubject.value.imageURL
    ) {
      thirdLength = 0;
    }
    this.charCount.next(
      this.characterLimit - (headlineLength + subheadLength + thirdLength)
    );
  }

  private adCreated(ad: Ad): void {
    this.translationService
      .getTranslation('CAMPAIGN.CREATION.GENERATOR.ADDED_TO_CAMPAIGN', {
        adName: ad.name,
      })
      .pipe(take(1))
      .subscribe((text: string) => {
        this.snackBarService.open(text);
      });
  }

  public convertTemplateSizeToFile(templateProps: object) {
    this.getStyles$
      .pipe(
        switchMap((styles: string) => {
          templateProps['styleTag'].appendChild(
            document.createTextNode(styles)
          );
          return this.http.post(
            // If you plan on testing this out locally I recommend running
            // the firebase function locally and using that url
            this.environment.SVG_TO_PNG_URL,
            templateProps['node'].outerHTML,
            {
              responseType: 'blob',
            }
          );
        }),
        take(1)
      )
      .subscribe(
        async (response) => {
          if (this.rendering.value) {
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(response);
            const image = new Image();
            image.src = imageUrl;
            const file: any = response;
            file.lastModifiedDate = new Date();
            file.name = `${this.generatorInfoSubject.value.headline}-${templateProps['width']}x${templateProps['height']}.png`;
            this.files.push(<File>file);

            this.ngZone.run(() => {
              this.spinnerRef.componentInstance.percentComplete = Math.round(
                (100 / this.genAdSizes.length) * this.files.length
              );
              this.spinnerRef.componentInstance.loadingMessage = this.translateSpinner();
              if (this.files.length >= this.genAdSizes.length) {
                this.renderingCleanUp(true);
                this.uploadAd(this.files);
              }
            });
          }
        },
        (err) => {
          console.error(err);
          this.renderingCleanUp();
          this.translationService
            .getTranslation('CAMPAIGN.CREATION.GENERATOR.FAILED_TO_GENERATE', {
              width: templateProps['width'],
              height: templateProps['height'],
            })
            .pipe(take(1))
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        }
      );
  }

  private renderingCleanUp(keepFiles = false) {
    this.ngZone.run(() => {
      this.rendering.next(false);
      if (!keepFiles) {
        this.files = [];
      }
      this.spinnerRef.close();
      this.updateShowSizes(false);
    });
  }

  public saveGeneratedAd(): boolean {
    if (!this.validateSelectedTemplate()) {
      return false;
    }

    if (this.charCount.value < 0) {
      alert(
        `The text in your ad must be less than ${this.characterLimit} characters.`
      );
      return false;
    }

    if (!this.rendering.value) {
      this.getStyles$ = this.http
        .get(
          `assets/generator-styles/${this.selectedTemplateSubject.value.toLowerCase()}.css`,
          '',
          { responseType: 'text' }
        )
        .pipe(shareReplay(1));
      this.rendering.next(true);
      this.ngZone.run(() => {
        this.spinnerRef = this.dialog.open(ProgressSpinnerComponent, {
          panelClass: 'transparent',
          disableClose: true,
        });
        this.spinnerRef.componentInstance.percentComplete = 0;
        this.spinnerRef.componentInstance.loadingMessage = this.translateSpinner();

        this.updateShowSizes(true);
      });
    }
    return true;
  }

  private updateShowSizes(show: boolean) {
    const showSizes = [];
    for (const _size of this.genAdSizes) {
      showSizes.push(show);
    }
    this.showSizes.next(showSizes);
  }

  /**
   * Validate required fields depending on which template is selected
   * @returns true if validated false if missing required fields
   */
  private validateSelectedTemplate(): boolean {
    const g = this.generatorInfoSubject.value;
    const t = this.selectedTemplateSubject.value;
    const brandRequired =
      t === GeneratorTemplate.BASIC ||
      t === GeneratorTemplate.BASIC_INVERT ||
      t === GeneratorTemplate.BASIC_REFLECT ||
      t === GeneratorTemplate.BASIC_ANGLE;
    // All templates require headline
    if (!g.headline || g.headline === 'CAMPAIGN.CREATION.GENERATOR.HEADLINE') {
      this.translationService
        .getTranslation('CAMPAIGN.CREATION.GENERATOR.MISSING_HEADLINE')
        .pipe(take(1))
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });
      return false;
    }
    if (brandRequired) {
      if (
        !(g.third || g.imageURL) ||
        (g.third === 'CAMPAIGN.CREATION.GENERATOR.THIRD' && !g.imageURL)
      ) {
        this.translationService
          .getTranslation('CAMPAIGN.CREATION.GENERATOR.MISSING_THIRD')
          .pipe(take(1))
          .subscribe((text: string) => {
            this.snackBarService.open(text);
          });
        return false;
      }
    }
    return true;
  }

  public uploadImage(image: File, callback: (result) => {}): void {
    if (image.size > this.maxImageSize) {
      this.translationService
        .getTranslation('CAMPAIGN.CREATION.GENERATOR.MAX_IMAGE_SIZE', {
          limit: `${Math.round(this.maxImageSize / Math.pow(1024, 2))} MB`, // connvert bytes to megabytes
        })
        .pipe(take(1))
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });
    } else if (image.type === 'image/svg+xml' || !image.type.match('image/*')) {
      this.translationService
        .getTranslation('CAMPAIGN.CREATION.GENERATOR.NOT_IMAGE')
        .pipe(take(1))
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });
    } else {
      loadImage(
        image,
        (img: HTMLCanvasElement) => {
          let fileName = image.name;
          const url = img.toDataURL(image.type);
          const dataURLStart = 'data:' + image.type;
          if (url.slice(0, dataURLStart.length) !== dataURLStart) {
            fileName = fileName.replace(/\.\w+$/, '.png');
          }
          this.updateImageURL(url);
          callback(url);
        },
        {
          canvas: true,
          orientation: true,
        }
      );
    }
  }

  public uploadAd(files: File[]): void {
    this.uploader.files = files;
    this.uploadService
      .prepareFilesForUpload(this.uploader)
      .then(() => {
        const dialogRef = this.dialog.open(UploadQueueDialogComponent, {
          minWidth: '50vw',
          maxWidth: '60vw',
          disableClose: true,
          data: {
            uploader: this.uploader,
            generatorTemplate: this.selectedTemplateSubject.value,
          },
        });
        dialogRef
          .afterClosed()
          .subscribe((obj: { reload?: boolean; adCreated?: Ad } = {}) => {
            this.files = [];
            if (obj.reload) {
              this.adsService.getAds(true);
              if (obj.adCreated) {
                this.savedAd$.next(obj.adCreated);
                // Outputting created Ad
                this.adCreated(obj.adCreated);
              }
            }
          });
      })
      .catch((err) => {
        console.error(err);
        this.dialog.closeAll();
      });
  }

  private translateSpinner(): string {
    let translation = '';
    this.translationService
      .getTranslation('CAMPAIGN.CREATION.GENERATOR.RENDERING_MESSAGE')
      .pipe(take(1))
      .subscribe((text: string) => {
        translation = text;
      });
    return translation;
  }
}
