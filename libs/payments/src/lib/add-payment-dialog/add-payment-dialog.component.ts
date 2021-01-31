import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppRoutes, Card, PaymentService } from '@marketplace/core';

const MAX_CHARGE = 10000000000;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-add-payment-dialog',
  templateUrl: './add-payment-dialog.component.html',
  styleUrls: ['./add-payment-dialog.component.scss'],
})
export class AddPaymentDialogComponent implements OnInit {
  public cardRoute = AppRoutes.CARDS;
  public chargeAmount: any;
  public maxCharge: number = MAX_CHARGE;
  public cards = [];

  public paymentForm = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
      Validators.max(MAX_CHARGE),
    ]),
    cardId: new FormControl(null, [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<AddPaymentDialogComponent>,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.paymentService
      .cards()
      .then((cards: Array<Card>) => {
        this.cards = cards;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public close(): void {
    this.dialogRef.close();
  }
}
