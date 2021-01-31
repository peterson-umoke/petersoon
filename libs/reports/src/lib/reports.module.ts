import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { CampaignSpendComponent } from './campaign-spend/campaign-spend.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PopComponent } from './pop/pop.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    CampaignSpendComponent,
    InvoiceComponent,
    PopComponent,
    ReportsComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ReportsModule {}
