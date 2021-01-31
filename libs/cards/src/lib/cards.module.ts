import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards/cards.component';
import { ChargeCardDialogComponent } from './charge-card-dialog/charge-card-dialog.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    CardsRoutingModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [
    CardDetailsComponent,
    CardsComponent,
    ChargeCardDialogComponent,
  ],
})
export class CardsModule {}
