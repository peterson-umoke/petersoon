import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { AddCreditDialogComponent } from './add-credit-dialog/add-credit-dialog.component';
import { AddPaymentDialogComponent } from './add-payment-dialog/add-payment-dialog.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments/payments.component';

@NgModule({
  declarations: [
    AddCreditDialogComponent,
    AddPaymentDialogComponent,
    PaymentsComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    PaymentsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class PaymentsModule {}
