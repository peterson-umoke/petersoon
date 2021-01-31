import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { PreferencesRoutingModule } from './preferences-routing.module';
import { PreferencesComponent } from './preferences.component';

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    CoreModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PreferencesRoutingModule,
    TranslateModule,
  ],
})
export class PreferencesModule {}
