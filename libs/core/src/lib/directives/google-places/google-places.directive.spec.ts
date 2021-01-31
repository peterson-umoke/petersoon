import { ElementRef } from '@angular/core';
import { GooglePlacesDirective } from './google-places.directive';

describe('GooglePlacesDirective', () => {
  it('should create an instance', () => {
    const element = new ElementRef({});
    const directive = new GooglePlacesDirective(element, null);
    expect(directive).toBeTruthy();
  });
});
