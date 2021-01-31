import { AgmCoreModule } from '@agm/core';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import {
  AngularFireModule,
  FIREBASE_APP_NAME,
  FIREBASE_OPTIONS,
} from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BLIP_CONFIG,
  CoreModule,
  Environment,
  MaterialModule,
} from '@marketplace/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IntercomModule } from 'ng-intercom';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { PrivacyPolicyDialogComponent } from './privacy-policy-dialog/privacy-policy-dialog.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegisterComponent } from './register/register.component';
import { RewardsComponent } from './rewards/rewards.component';
import { JwtInterceptor } from './_interceptors/jwt/jwt.interceptor';

// Translation Services
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    environment.TRANSLATION_URL,
    `.json?v=${environment.version}`
  );
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    LoginComponent,
    PrivacyPolicyDialogComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    RewardsComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_JS_MAPS_KEY,
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG, 'Marketplace'),
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    CoreModule,
    FlexLayoutModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    IntercomModule.forRoot({
      appId: environment.INTERCOM_ID,
      updateOnRouterChange: true,
    }),
    // ServiceWorkerModule.register(`/ngsw-worker.js`, { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: Environment, useValue: environment },
    { provide: LOCALE_ID, useValue: environment.LOCALE_ID },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    { provide: MAT_DATE_LOCALE, useValue: environment.LOCALE_ID },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },

    // Moved from CORE
    {
      provide: BLIP_CONFIG,
      useValue: {
        API_URL: environment.API_URL,
        FIREBASE_CONFIG: environment.FIREBASE_CONFIG,
      },
    },
    { provide: FIREBASE_OPTIONS, useValue: environment.FIREBASE_CONFIG },
    { provide: FIREBASE_APP_NAME, useValue: 'BlipCore' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
