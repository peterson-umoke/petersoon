import { CurrencyDirective } from './currency.directive';

describe('CurrencyDirective', () => {
  it('should create an instance', () => {
    const directive = new CurrencyDirective(null, null, null);
    expect(directive).toBeTruthy();
  });
});
