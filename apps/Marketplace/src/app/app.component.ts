import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import {
  GeoLocationService,
  LoadingService,
  RouterService,
  ServiceWorkerService,
  SnackBarMessage,
  SnackBarService,
  TitleService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import * as _ from 'lodash';
import { Intercom } from 'ng-intercom';
import { map } from 'rxjs/operators';

const FOOTER_HEIGHT = 72;
const FOOTER_HEIGHT_PLUS_PADDING = FOOTER_HEIGHT + 16;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked, AfterViewInit, OnInit {
  private interval;
  private snackBarVerticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public showFooter = true;
  // @HostListener('window:scroll', []) onScroll() {
  //   // When user scrolls, we know the viewport is larger
  //   // and the moving of the intercom icon should be handled
  //   // with scroll events
  //   clearInterval(this.interval);
  //   this.moveIntercomIcon();
  // }

  constructor(
    private domSanitizer: DomSanitizer,
    private geoLocationService: GeoLocationService,
    private intercom: Intercom,
    private snackBar: MatSnackBar,
    public loadingService: LoadingService,
    private matIconRegistry: MatIconRegistry,
    private routerService: RouterService,
    private serviceWorkerService: ServiceWorkerService,
    private titleService: TitleService,
    private translationService: TranslationService,
    private snackBarService: SnackBarService,
    private media: MediaObserver,
    public userService: UserService // Used in HTML
  ) {
    this.intercom.hide();
    this.serviceWorkerService.checkForUpdate();
    this.translationService.init();

    this.addMatSvgIcon('rread', 'RRead');
    this.addMatSvgIcon('lread', 'LRead');
    this.addMatSvgIcon('dimensions', 'dimensions');
    this.addMatSvgIcon('vert-dimensions', 'vert-dimensions');
    this.addMatSvgIcon('duration', 'duration');
    this.addMatSvgIcon('twitter', 'twitter');
    this.addMatSvgIcon('facebook', 'facebook');
    this.addMatSvgIcon('linkedin', 'linkedin');
    this.addMatSvgIcon('instagram', 'instagram');
    this.addMatSvgIcon('content-copy', 'content-copy');
    this.addMatSvgIcon('portrait-img', 'portrait');
    this.addMatSvgIcon('landscape-img', 'landscape');
  }

  ngOnInit() {
    this.titleService.init();

    this.routerService.$route.subscribe((route: string) => {
      // clearInterval(this.interval);
      // // For pages that do not fill up the whole viewport,
      // // ensure that the intercom icon is not over the footer
      // this.interval = setInterval(() => this.moveIntercomIcon(), 200);
      // setTimeout(() => {
      //   // We do not want the interval to continue after the icon has been moved
      //   clearInterval(this.interval);
      // }, 5000);

      (<any>window).ga('set', 'page', route);
      (<any>window).ga('send', 'pageview');
    });
    this.snackBarService.snackBarMessage$.subscribe((m: SnackBarMessage) => {
      this.snackBar.open(m.message, null, {
        duration: m.duration,
        verticalPosition: this.snackBarVerticalPosition,
      });
    });
    this.media
      .asObservable()
      .pipe(
        map((changes: MediaChange[]) =>
          Boolean(_.find(changes, (change) => change.mqAlias === 'lt-md'))
        )
      )
      .subscribe((mobile: boolean) => {
        this.snackBarVerticalPosition = mobile ? 'top' : 'bottom';
      });
  }

  ngAfterViewChecked() {
    this.initializeGoogleOptimize();
  }

  ngAfterViewInit() {
    // Needs to check if google is defined
    if (typeof google === 'object' && typeof google.maps === 'object') {
      this.geoLocationService.requestLocation(new EventEmitter());
    } else {
      setTimeout(() => {
        this.ngAfterViewInit();
      });
    }
  }

  private addMatSvgIcon(name: string, svgName: string) {
    this.matIconRegistry.addSvgIcon(
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://blipbillboards-marketplace.s3.amazonaws.com/svg/${svgName}.svg`
      )
    );
  }

  private initializeGoogleOptimize() {
    if (window['dataLayer']) {
      window['dataLayer'].push({
        event: 'optimize.activate',
      });
    }
  }

  private isInViewport(bounding: ClientRect) {
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) +
          FOOTER_HEIGHT &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth) +
          FOOTER_HEIGHT
    );
  }

  private moveIntercomIcon() {
    if (document) {
      const footer = document.querySelector('app-footer');
      const bounds = footer.getBoundingClientRect();
      const bottom =
        FOOTER_HEIGHT_PLUS_PADDING -
        (bounds.bottom - document.documentElement.clientHeight);
      const intercom = document.getElementsByClassName('intercom-app');
      // Ensure the intercom icon exists on the page
      if (intercom.length) {
        const iframe = intercom[0].querySelector('iframe');
        if (iframe) {
          if (this.isInViewport(bounds)) {
            iframe.style.bottom = `${bottom}px`;
          } else {
            iframe.style.bottom = '20px';
          }
        }
      }
    }
  }
}
