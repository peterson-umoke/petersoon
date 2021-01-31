import { EventEmitter, Injectable } from '@angular/core';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private place: google.maps.places.PlaceResult;

  constructor(
    private organizationService: OrganizationService,
    private userService: UserService
  ) {}

  public formatResults(
    place: google.maps.places.PlaceResult
  ): Promise<google.maps.places.PlaceResult> {
    const results: google.maps.places.PlaceResult = {
      address_components: place.address_components,
      formatted_address: place.formatted_address,
      formatted_phone_number: place.formatted_phone_number,
      geometry: place.geometry,
      id: place.id,
      international_phone_number: place.international_phone_number,
      name: place.name,
      opening_hours: place.opening_hours,
      place_id: place.place_id,
      rating: place.rating,
      types: place.types,
      url: place.url,
      utc_offset: place.utc_offset_minutes,
      vicinity: place.vicinity,
      website: place.website,
    };
    return Promise.resolve(results);
  }

  private async getLocation(
    placeId: string
  ): Promise<google.maps.places.PlaceResult> {
    return new Promise(async (resolve) => {
      const serv = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      serv.getDetails(
        { placeId },
        async (placeResult: google.maps.places.PlaceResult) => {
          const place = await this.formatResults(placeResult);
          resolve(place);
        }
      );
    });
  }

  public async requestLocation(
    emitter: EventEmitter<google.maps.places.PlaceResult>
  ) {
    if (this.place) {
      this.saveLocation();
      emitter.emit(this.place);
    } else {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          async (location) => {
            const currentLatLon = new google.maps.LatLng(
              location.coords.latitude,
              location.coords.longitude
            );
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: currentLatLon },
              async (
                results: google.maps.GeocoderResult[],
                status: google.maps.GeocoderStatus
              ) => {
                if (results.length) {
                  const placeId = results[0].place_id;
                  this.place = await this.getLocation(placeId);
                  this.saveLocation();
                  emitter.emit(this.place);
                }
              }
            );
          },
          (error) => {},
          { timeout: 10000 }
        );
      }
    }
  }

  /**
   * Saves users GeoLocation onto the current organization
   * @param place
   */
  private async saveLocation() {
    const organization = this.userService.organization;

    if (
      organization &&
      this.place &&
      (!organization.location || organization.location['id'] !== this.place.id)
    ) {
      organization.location = this.place;
      try {
        await this.organizationService.update(organization);
      } catch (error) {
        // Do nothing with the error
      }
    }
  }
}
