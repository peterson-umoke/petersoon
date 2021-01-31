import { TestBed, waitForAsync } from '@angular/core/testing';
import { MediaObserver } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  GeoLocationService,
  LoadingService,
  MaterialModule,
  RouterService,
  ServiceWorkerService,
  SnackBarService,
  TitleService,
  TranslationService,
  UserService,
} from '@marketplace/core';
import * as _ from 'lodash';
import { Intercom } from 'ng-intercom';
import { MockComponents } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, MaterialModule],
        declarations: [
          AppComponent,
          MockComponents(HeaderComponent, FooterComponent),
        ],
        providers: [
          {
            provide: DomSanitizer,
            useValue: { bypassSecurityTrustResourceUrl: _.identity },
          },
          {
            provide: GeoLocationService,
            useValue: { requestLocation: _.noop },
          },
          { provide: Intercom, useValue: { hide: _.noop } },
          { provide: LoadingService, useValue: {} },
          { provide: MatIconRegistry, useValue: { addSvgIcon: _.noop } },
          { provide: RouterService, useValue: { $route: EMPTY } },
          {
            provide: ServiceWorkerService,
            useValue: { checkForUpdate: _.noop },
          },
          { provide: TitleService, useValue: { init: _.noop } },
          { provide: TranslationService, useValue: { init: _.noop } },
          { provide: UserService, useValue: {} },
          { provide: MediaObserver, useValue: { asObservable: () => EMPTY } },
          { provide: SnackBarService, useValue: { snackBarMessage$: EMPTY } },
        ],
      }).compileComponents();
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
