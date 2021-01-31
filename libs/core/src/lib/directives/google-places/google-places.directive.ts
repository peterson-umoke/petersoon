import {
  Directive,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { GeoLocationService } from './../../services';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appGooglePlaces]',
})
export class GooglePlacesDirective implements OnInit {
  @Output() placeChange: EventEmitter<
    google.maps.places.PlaceResult
  > = new EventEmitter();

  private element: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private geoLocationService: GeoLocationService
  ) {
    this.element = this.elementRef.nativeElement;
  }

  async ngOnInit() {
    // If browser cannot get location, allow user to type it in manually
    const autocomplete = new google.maps.places.Autocomplete(this.element);
    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace();

      // If user presses enter without selecting a location
      if (typeof place.address_components === 'undefined') {
        this.getFirstSuggestion(place.name);
      } else {
        const results = await this.geoLocationService.formatResults(place);
        this.placeChange.emit(results);
      }
    });
  }

  private getFirstSuggestion(input: string) {
    // AutocompleteService is used to grab place predictions in order to select first place
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input,
      },
      (predictions, status) => {
        // If location entered exists
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const request = { placeId: predictions[0].place_id };
          const serv = new google.maps.places.PlacesService(
            document.createElement('div')
          );
          serv.getDetails(
            request,
            async (place: google.maps.places.PlaceResult) => {
              const result = await this.geoLocationService.formatResults(place);
              this.placeChange.emit(result);
            }
          );
        }
      }
    );
  }
}
