import { Pipe, PipeTransform } from '@angular/core';
import { PaymentProcessingCode } from '../../models';

@Pipe({
  name: 'paymentCodeString',
})
export class PaymentCodeStringPipe implements PipeTransform {
  transform(code: number): string {
    const codeName = Object.keys(PaymentProcessingCode).find(
      (key) => PaymentProcessingCode[key] === code
    );
    return `PAYMENT.PROCESSING_CODE.${codeName ?? 'SUCCESS'}`;
  }
}
