import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Environment, Payment } from '../../models';
import { TranslationService, UserService } from '../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnChanges, OnInit {
  @Input() payments: any[];
  public displayedColumns: string[] = ['created', 'amount', 'processing_code'];
  public dataSource = new MatTableDataSource<any[]>([]);

  constructor(
    private userService: UserService,
    public translationService: TranslationService,
    private environment: Environment
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(changes.payments.currentValue);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.payments);
  }

  public payment(payment: Payment) {
    window.open(
      `${this.environment.API_URL}/api/payment/${this.userService.organization.id}/${payment.id}.pdf`,
      '_blank'
    );
  }
}
