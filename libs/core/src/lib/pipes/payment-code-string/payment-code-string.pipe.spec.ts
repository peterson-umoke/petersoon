import { PaymentCodeStringPipe } from './payment-code-string.pipe';

describe('PaymentCodeStringPipe', () => {
  it('create an instance', () => {
    const pipe = new PaymentCodeStringPipe();
    expect(pipe).toBeTruthy();
  });
});
