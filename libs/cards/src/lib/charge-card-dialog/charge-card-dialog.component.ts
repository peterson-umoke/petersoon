import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

const MAX_CHARGE = 100000;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-charge-card-dialog',
  templateUrl: './charge-card-dialog.component.html',
  styleUrls: ['./charge-card-dialog.component.scss'],
})
export class ChargeCardDialogComponent implements OnInit {
  public chargeAmount: any;
  public maxCharge: number = MAX_CHARGE;

  public chargeForm = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
      Validators.max(MAX_CHARGE),
    ]),
  });

  constructor(public dialogRef: MatDialogRef<ChargeCardDialogComponent>) {}

  ngOnInit() {}

  public close(): void {
    this.dialogRef.close();
  }
}
