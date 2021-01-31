import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('KeysPipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipe(<any>{});
    expect(pipe).toBeTruthy();
  });
});
