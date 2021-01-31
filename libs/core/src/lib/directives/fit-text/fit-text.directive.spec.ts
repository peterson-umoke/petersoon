import { FitTextDirective } from './fit-text.directive';

describe('FitTextDirective', () => {
  it('should create an instance', () => {
    const directive = new FitTextDirective(
      { nativeElement: { parentElement: '' } },
      null
    );
    expect(directive).toBeTruthy();
  });
});
