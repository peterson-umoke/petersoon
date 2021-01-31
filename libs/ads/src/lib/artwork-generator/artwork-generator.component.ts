import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { GeneratorTemplate } from '@marketplace/core';
import ColorThief from 'colorthief';
import domtoimage from 'dom-to-image-font-patch';
import { badWordsList } from './badWords';
import { saveAs } from 'file-saver';
import { fromEvent, Observable, Subject } from 'rxjs';
import { first, map, pluck, take, takeUntil } from 'rxjs/operators';
import { ColorPickerComponent } from '../artwork-generator/color-picker/color-picker/color-picker.component';
import {
  ArtworkGeneratorService,
  GenAdSize,
  GeneratorInfo,
  GenFont,
} from '../services/artwork-generator-service/artwork-generator.service';
import { FontBottomSheetComponent } from './font-bottom-sheet/font-bottom-sheet.component';

@Component({
  selector: 'ads-artwork-generator',
  templateUrl: './artwork-generator.component.html',
  styleUrls: ['./artwork-generator.component.scss'],
})
export class ArtworkGeneratorComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private destroy$: Subject<boolean> = new Subject();

  public generatorForm: FormGroup;
  public browserIsSafari = false;
  public showPreviewOverlay = true;
  public generatorInfo$: Observable<GeneratorInfo>;
  public genFonts: GenFont[] = [
    'Arbutus Slab',
    // 'Baloo Da',
    'Barlow',
    // 'Exo',
    'Lato',
    'Merriweather',
    'Montserrat',
    // 'Oswald',
  ];

  public selectedTemplate$: Observable<GeneratorTemplate>;
  @ViewChild('hiddenLogo', { static: false })
  public hiddenLogo: ElementRef;
  public logoColors: string[];
  public headlineMax: number;
  public subheadMax: number;
  public thirdMax: number;
  public genAdSizes: GenAdSize[];
  public rendering$: Observable<boolean>;
  public showSizes$: Observable<boolean[]>;
  public charCount$: Observable<number>;
  public selectedColor$: Observable<string>;

  public isPhoneError = false;
  public isUrlError = false;
  public isVulgarError = false;
  public isHeadlineError = false;
  public isSubHeadError = false;

  public urlState = '';
  public urlRemoval = '';
  public websiteUrl = '';

  constructor(
    private bottomSheet: MatBottomSheet,
    private artworkGeneratorService: ArtworkGeneratorService,
    private ngZone: NgZone
  ) {
    this.generatorForm = this.artworkGeneratorService.generatorForm;
    this.headlineMax = this.artworkGeneratorService.headlineMax;
    this.subheadMax = this.artworkGeneratorService.subheadMax;
    this.thirdMax = this.artworkGeneratorService.thirdMax;
    this.genAdSizes = this.artworkGeneratorService.genAdSizes;

    this.selectedTemplate$ = this.artworkGeneratorService.selectedTemplate$.pipe(
      takeUntil(this.destroy$)
    );
    this.generatorInfo$ = this.artworkGeneratorService.generatorInfo$;

    this.rendering$ = this.artworkGeneratorService.rendering$.pipe(
      takeUntil(this.destroy$)
    );
    this.showSizes$ = this.artworkGeneratorService.showSizes$.pipe(
      takeUntil(this.destroy$)
    );
    this.charCount$ = this.artworkGeneratorService.charCount$.pipe(
      takeUntil(this.destroy$)
    );
    this.selectedColor$ = this.generatorInfo$.pipe(
      pluck('primary'),
      map((primary) => primary.background)
    );
  }

  ngOnInit() {
    const uA = navigator.userAgent;
    this.browserIsSafari =
      uA.toLowerCase().indexOf('safari') !== -1 &&
      uA.toLowerCase().indexOf('chrome') === -1;
    this.generatorForm
      .get('headline')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((o) => {
        this.validatePhone(o, 'headline');
        this.checkfoul(o, 'headline');
        this.validateUrl(o, 'headline');
      });
    this.generatorForm
      .get('subhead')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((o) => {
        this.validatePhone(o, 'subhead');
        this.checkfoul(o, 'subhead');
        this.validateUrl(o, 'subhead');
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.hiddenLogo.nativeElement, 'load')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const colorThief = new ColorThief();
        const result = colorThief.getPalette(this.hiddenLogo.nativeElement, 4);
        const rgbToHex = (r, g, b) =>
          '#' +
          [r, g, b]
            .map((x) => {
              const hex = x.toString(16);
              return hex.length === 1 ? '0' + hex : hex;
            })
            .join('');
        const logoColors = [];
        for (const color of result) {
          logoColors.push(rgbToHex(color[0], color[1], color[2]));
        }
        this.logoColors = logoColors;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public downloadPreview(preview: HTMLElement): void {
    if (!this.browserIsSafari) {
      this.showPreviewOverlay = false;
      this.ngZone.onMicrotaskEmpty.pipe(first()).subscribe(() => {
        domtoimage.toBlob(preview).then((blob: Blob) => {
          this.generatorInfo$
            .pipe(pluck('headline'), take(1))
            .subscribe((headline) => {
              this.showPreviewOverlay = true;
              saveAs(blob, `${headline}.png`);
            });
        });
      });
    }
  }

  public receiveReadyFromTemplate(templateProps: object) {
    this.artworkGeneratorService.convertTemplateSizeToFile(templateProps);
  }

  public openColorBottomSheet(): void {
    this.bottomSheet.open(ColorPickerComponent, {
      data: {
        colors: this.logoColors,
        callback: (color: string) => {
          this.updateColor(color);
        },
      },
    });
  }

  public openFontBottomSheet(): void {
    const fontSheet = this.bottomSheet.open(FontBottomSheetComponent);
    const instance = fontSheet.instance;
    this.generatorInfo$.pipe(pluck('font'), take(1)).subscribe((font) => {
      instance.selectedFont = font;
    });
    const subscription = instance.fontSelected.subscribe((font: GenFont) => {
      this.updateFont(font);
    });
    fontSheet
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => {
        subscription.unsubscribe();
      });
  }

  public removeImage(): void {
    this.artworkGeneratorService.updateImageURL(null);
    this.logoColors = null;
    this.hiddenLogo.nativeElement.src = null;
  }

  public updateFont(font: GenFont): void {
    this.artworkGeneratorService.updateFont(font);
  }

  public updateColor(color: string): void {
    this.artworkGeneratorService.updateColor(color);
  }

  public uploadImage(image: File): void {
    this.artworkGeneratorService.uploadImage(
      image,
      (result) => (this.hiddenLogo.nativeElement.src = result)
    );
  }
  public checkErrorLocation(location: string) {
    if (location === 'headline') {
      this.isHeadlineError = true;
      this.isSubHeadError = false;
    } else {
      this.isHeadlineError = false;
      this.isSubHeadError = true;
    }
  }
  public validatePhone(str, location: string) {
    const regex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim;
    if (regex.test(str)) {
      //checks if error is on headline input
      this.checkErrorLocation(location);
      this.isPhoneError = true;
    } else {
      this.isPhoneError = false;
    }
  }
  public checkfoul(str, location: string) {
    let isFoul;
    for (const foul of badWordsList) {
      isFoul = !!~str.toLowerCase().indexOf(foul.toLowerCase());
      isFoul ? (this.isVulgarError = true) : (this.isVulgarError = false);
      if (isFoul) break;
    }
    this.checkErrorLocation(location);
    return isFoul;
  }

  public validURL(str: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }

  public validateUrl(str: string, location: string) {
    const REGEX_NO_PREFIX = /(?:^[a-zA-Z0-9_]+\.\w{2,})$/;
    const REGEX_HTTP_PREFIX = /(?:^http[s]?:\/\/(?:w{3}\.)?[a-zA-Z0-9_]+\.(?!(?:com|net|org|gov))\w{2,3})$/;
    const REGEX_WWW_PREFIX = /(?:^(?:w{3}\.)[a-zA-Z0-9_]+\.(?!(?:com|net|org|gov))\w{2,3})$/;
    let tokens = str.split(' ');
    let matches = null;
    if (str === '') {
      this.isUrlError = false;
      return;
    }
    tokens = tokens.filter((token) => this.validURL(token));

    matches = tokens.map((token) => ({
      token,
      test:
        REGEX_NO_PREFIX.test(token) ||
        REGEX_HTTP_PREFIX.test(token) ||
        REGEX_WWW_PREFIX.test(token),
    }));

    const isErr = matches.some((o) => o.test === false);
    this.isUrlError = isErr;

    const errToken = matches.filter((o) => o.test === false);

    if (isErr) {
      this.checkErrorLocation(location);
      const token_ = errToken[0].token;
      this.isUrlError = isErr;
      this.websiteUrl = token_.match(/[a-zA-Z0-9_]+\.\w+$/)[0];
      this.urlState = token_.replace(/[a-zA-Z0-9_]+\.\w+$/, '');
    }
  }

  public cancelToolTip() {
    (this.isUrlError = false),
      (this.isPhoneError = false),
      (this.isVulgarError = false);
  }
}
