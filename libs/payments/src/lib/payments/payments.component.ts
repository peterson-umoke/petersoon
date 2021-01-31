import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CurrencyService,
  OrganizationInfo,
  Payment,
  PaymentService,
  UserService,
} from '@marketplace/core';
import { combineLatest, Subscription } from 'rxjs';
import { AddCreditDialogComponent } from '../add-credit-dialog/add-credit-dialog.component';
import { AddPaymentDialogComponent } from '../add-payment-dialog/add-payment-dialog.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  public canAddCredit: boolean;
  public canAddPayment = true;
  public payments: Payment[] = [];
  private isSuperUser = false;

  constructor(
    private dialog: MatDialog,
    private currencyService: CurrencyService,
    private paymentService: PaymentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      combineLatest([
        this.userService.$profile,
        this.userService.$selectedOrgInfo,
      ]).subscribe(([profile, orgInfo]) => {
        if (orgInfo) {
          this.canAddCredit =
            orgInfo.permissions.indexOf('create_payment') > -1;
          this.isSuperUser = profile.user.is_superuser ? true : false;
          this.getPayments();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getPayments() {
    this.paymentService
      .getAllPayments()
      .then((payments: Array<Payment>) => {
        if (payments) {
          this.payments = payments;
          let count = 0;
          for (const payment of payments) {
            // Calculate the hour difference between today and payment creation date.
            const diff =
              Math.abs(
                new Date().getTime() - new Date(payment.created).getTime()
              ) / 36e5;
            if (diff <= 24) {
              count += 1;
              if (count >= 2) {
                this.canAddPayment = this.isSuperUser ? true : false;
                break;
              }
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Add a new credit
   */
  public newCredit() {
    const dialog = this.dialog.open(AddCreditDialogComponent, {
      minWidth: '24vw',
      maxWidth: '60vw',
      disableClose: true,
    });

    dialog
      .afterClosed()
      .subscribe((value: { amount: string; details: string; type: string }) => {
        if (value) {
          const payment = {
            amount: this.currencyService.toNumber(value.amount),
            details: { notes: value.details },
            type: value.type,
          };
          this.paymentService
            .addPayment(payment)
            .then(() => {
              this.getPayments();
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
  }

  /**
   * Add a new payment
   */
  public newPayment() {
    const dialog = this.dialog.open(AddPaymentDialogComponent, {
      minWidth: '24vw',
      maxWidth: '60vw',
      disableClose: true,
    });

    dialog
      .afterClosed()
      .subscribe((value: { cardId: string; amount: number }) => {
        if (value) {
          this.paymentService
            .chargeCard(value)
            .then(() => {
              this.getPayments();
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
  }
}
