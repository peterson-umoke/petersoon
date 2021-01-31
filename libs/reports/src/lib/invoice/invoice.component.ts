import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ReportsApiService } from '@marketplace/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  @Input() organization: string;

  public date = new FormControl(moment());

  constructor(private reportsApiService: ReportsApiService) {}

  public chosenMonthHandler(date: Moment, datepicker: MatDatepicker<Moment>) {
    this.updateDate(date);
    datepicker.close();
  }

  public chosenYearHandler(date: Moment) {
    this.updateDate(date);
  }

  public openInvoice() {
    const month = moment(this.date.value).format('MM');
    const year = moment(this.date.value).format('YYYY');
    this.reportsApiService.invoiceReport(this.organization, month, year);
  }

  private updateDate(date: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.month(date.month());
    ctrlValue.year(date.year());
    this.date.setValue(ctrlValue);
  }
}
