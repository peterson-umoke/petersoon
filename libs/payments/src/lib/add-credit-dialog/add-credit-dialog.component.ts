import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

const MAX_CHARGE = 10000000000;
const TYPES = [
  'STANDARD',
  'PREPAY',
  'PROMOTIONAL_CREDIT',
  'REFUND_CREDIT',
  'REFUND_DEBIT',
];

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-add-credit-dialog',
  templateUrl: './add-credit-dialog.component.html',
  styleUrls: ['./add-credit-dialog.component.scss'],
})
export class AddCreditDialogComponent implements OnInit {
  public maxCharge: number = MAX_CHARGE;
  public creditForm = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
      Validators.max(MAX_CHARGE),
    ]),
    details: new FormControl(null, [Validators.required]),
    type: new FormControl(TYPES[0], [Validators.required]),
  });
  public types: any;

  constructor(public dialogRef: MatDialogRef<AddCreditDialogComponent>) {}

  ngOnInit() {
    this.types = TYPES;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
