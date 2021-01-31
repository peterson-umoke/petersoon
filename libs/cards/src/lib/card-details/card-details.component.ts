import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes, Payment, PaymentService } from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {
  private subscriptions = new Subscription();

  public cardsRoute = AppRoutes.CARDS;
  public payments: Array<Payment> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.paymentService
          .getPayments(params['cardId'])
          .then((payments: Array<Payment>) => {
            this.payments = payments;
          })
          .catch((error) => {
            this.router.navigateByUrl(AppRoutes.CARDS);
          });
      })
    );
  }
}
