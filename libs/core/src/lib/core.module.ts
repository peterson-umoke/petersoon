import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdMenuComponent } from './components/ad-menu/ad-menu.component';
import { AdUploadComponent } from './components/ad-upload/ad-upload.component';
import { AdsCardComponent } from './components/ads-card/ads-card.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { CurrencyConversionComponent } from './components/currency-conversion/currency-conversion.component';
import { DesignLinkComponent } from './components/design-link/design-link.component';
import { AddToPlaylistDialogComponent } from './components/dialogs/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { ChangeDialogComponent } from './components/dialogs/change-dialog/change-dialog.component';
import { SaveChangesComponent } from './components/dialogs/save-changes/save-changes.component';
import { TermsAndConditionsComponent } from './components/dialogs/terms-and-conditions/terms-and-conditions.component';
import { UploadQueueDialogComponent } from './components/dialogs/upload-queue-dialog/upload-queue-dialog.component';
import { ImageOutlineComponent } from './components/image-outline/image-outline.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { CreditCardDirective } from './directives/credit-card/credit-card.directive';
import { CurrencyDirective } from './directives/currency/currency.directive';
import { DragDropDirective } from './directives/drag-drop/drag-drop.directive';
import { FitTextDirective } from './directives/fit-text/fit-text.directive';
import { GoogleAnalyticsDirective } from './directives/google-analytics/google-analytics.directive';
import { GooglePlacesDirective } from './directives/google-places/google-places.directive';
import { ImageViewerDirective } from './directives/image-viewer/image-viewer.directive';
import { PhoneNumberDirective } from './directives/phone-number/phone-number.directive';
import { UpdateOutlineGapDirective } from './directives/update-outline-gap/update-outline-gap.directive';
import { MaterialModule } from './modules/material.module';
import { AbbreviateStatePipe } from './pipes/abbreviate-state/abbreviate-state.pipe';
import { FilterPipe } from './pipes/filter/filter.pipe';
import { TemplateClassPipe } from './pipes/generator/template-class.pipe';
import { KeysPipe } from './pipes/keys/keys.pipe';
import { PaymentCodeStringPipe } from './pipes/payment-code-string/payment-code-string.pipe';
import { SafePipe } from './pipes/safe/safe.pipe';

const components = [
  AdUploadComponent,
  AdsCardComponent,
  CreditCardComponent,
  DesignLinkComponent,
  ChangeDialogComponent,
  SaveChangesComponent,
  TermsAndConditionsComponent,
  UploadQueueDialogComponent,
  ImageOutlineComponent,
  ImageViewerComponent,
  PaymentDetailsComponent,
  ProgressSpinnerComponent,
  CreditCardDirective,
  CurrencyDirective,
  DragDropDirective,
  GoogleAnalyticsDirective,
  GooglePlacesDirective,
  FitTextDirective,
  ImageViewerDirective,
  PhoneNumberDirective,
  UpdateOutlineGapDirective,
  FilterPipe,
  KeysPipe,
  SafePipe,
  TemplateClassPipe,
  PaymentCodeStringPipe,
  AbbreviateStatePipe,
  AdMenuComponent,
  AddToPlaylistDialogComponent,
  CurrencyConversionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    AngularFireAuthModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    FlexLayoutModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    FilterPipe,
    KeysPipe,
    SafePipe,
    TemplateClassPipe,
    PaymentCodeStringPipe,
    AbbreviateStatePipe,
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },
  ],
})
export class CoreModule {}
