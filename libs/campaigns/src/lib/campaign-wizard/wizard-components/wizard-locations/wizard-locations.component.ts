import { AgmMarker } from '@agm/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  BingMapsService,
  Coordinate,
  GoogleMapConstants,
  shareReplayRefCount,
  Sign,
  SignCluster,
  SignFilter,
} from '@marketplace/core';
import * as _ from 'lodash';
import { combineLatest, from, Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import { WizardLocationsService } from '../../../services/campaign-wizard/wizard-locations/wizard-locations.service';

const STANDARD_ITEM_SIZE = 156;
const MOBILE_ITEM_SIZE = 337;

@Component({
  selector: 'campaigns-wizard-locations',
  templateUrl: './wizard-locations.component.html',
  styleUrls: ['./wizard-locations.component.scss'],
  providers: [BingMapsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardLocationsComponent {
  @ViewChild('virtualScroll', { static: false })
  virtualScroll: CdkVirtualScrollViewport;
  private map: google.maps.Map;
  private zipPolygon: google.maps.Polygon;
  private selectedCluster: SignCluster;
  private currentBounds: google.maps.LatLngBounds;
  public mapExpand = false;
  public mapOptions: google.maps.MapOptions = GoogleMapConstants.MapOptions;
  public selectedFilter$: Observable<SignFilter>;
  public signFilters = SignFilter;
  public allVisibleToAdd: Sign[] = [];
  public selectedSignsCount$: Observable<number>;
  public visibleSigns$: Observable<Sign[]>;
  public visibleClusters$: Observable<SignCluster[]>;
  public visibleSignsCount$: Observable<number>;
  public allowAddingSigns$: Observable<boolean>;
  public allowAddingUniqueSign$: Observable<boolean>;
  public ltMd$: Observable<boolean>;
  public itemSize$: Observable<number>;
  public renderCardMaps$: Observable<boolean>;

  constructor(
    private bingMapsService: BingMapsService,
    private locationsService: WizardLocationsService,
    private campaignWizardService: CampaignWizardService,
    private media: MediaObserver
  ) {
    this.zipPolygon = new google.maps.Polygon({
      strokeColor: '#f56832',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillOpacity: 0,
    });
    this.selectedSignsCount$ = this.createSelectedSignsCountObservable();
    this.selectedFilter$ = this.locationsService.selectedFilter$;
    this.visibleSigns$ = this.locationsService.visibleSigns$;
    this.visibleClusters$ = this.locationsService.visibleClusters$;
    this.visibleSignsCount$ = this.createVisibleSignsCountObservable();
    this.allowAddingSigns$ = this.campaignWizardService.allowAddingSigns$;
    this.allowAddingUniqueSign$ = this.campaignWizardService.allowAddingUniqueSign$;
    this.ltMd$ = this.createLtMdObservable();
    this.itemSize$ = this.createItemSizeObservable();
    this.renderCardMaps$ = this.createRenderCardMapsObservable();
  }

  public signTrackByFn(_index: number, sign: Sign): string {
    return sign.id;
  }

  private createSelectedSignsCountObservable(): Observable<number> {
    return this.campaignWizardService.selectedSigns$.pipe(
      map((signs) => signs.length),
      shareReplayRefCount(1)
    );
  }

  private createVisibleSignsCountObservable(): Observable<number> {
    return this.visibleSigns$.pipe(
      filter((val) => val !== null),
      map((visibleSigns) => visibleSigns.length),
      shareReplayRefCount(1)
    );
  }

  private createLtMdObservable(): Observable<boolean> {
    return this.media.asObservable().pipe(
      map((changes: MediaChange[]) =>
        Boolean(_.find(changes, (change) => change.mqAlias === 'lt-md'))
      ),
      shareReplayRefCount(1)
    );
  }

  private createItemSizeObservable(): Observable<number> {
    return this.ltMd$.pipe(
      map((ltMd) => (ltMd ? MOBILE_ITEM_SIZE : STANDARD_ITEM_SIZE)),
      shareReplayRefCount(1)
    );
  }

  private createRenderCardMapsObservable(): Observable<boolean> {
    return this.media.asObservable().pipe(
      map((changes: MediaChange[]) =>
        Boolean(_.find(changes, (change) => change.mqAlias === 'lt-sm'))
      ),
      shareReplayRefCount(1)
    );
  }

  public updateCurrentBounds(bounds: google.maps.LatLngBounds) {
    this.currentBounds = bounds;
  }

  public updateVisible(): void {
    this.locationsService.updateMapBounds(this.currentBounds);
  }

  public filterSigns(signFilter: SignFilter): void {
    this.locationsService.updateSelectedFilter(signFilter);
  }

  public addVisibleSigns(): void {
    this.visibleSigns$.pipe(first()).subscribe((visibleSigns) => {
      this.campaignWizardService.addSigns(visibleSigns);
    });
  }

  public removeAllSigns(): void {
    this.campaignWizardService.removeSigns();
  }

  public mapReady(agmMap: google.maps.Map): void {
    this.map = agmMap;
  }

  public selectCluster(marker: AgmMarker): void {
    combineLatest([this.visibleClusters$, this.visibleSigns$])
      .pipe(first())
      .subscribe(([visibleClusters, visibleSigns]) => {
        this.selectedCluster = _.find(visibleClusters, (c: SignCluster) =>
          _.some(c.signs, (sign) => {
            return (
              sign.lat === marker.latitude && sign.lon === marker.longitude
            );
          })
        );
        this.virtualScroll.scrollToIndex(
          visibleSigns.indexOf(this.selectedCluster.signs[0])
        );
      });
  }

  public deselectClusters(): void {
    this.selectedCluster = null;
  }

  public signMarkerClicked(sign: Sign): boolean {
    if (this.selectedCluster) {
      return _.some(this.selectedCluster.signs, sign);
    } else {
      return false;
    }
  }

  public toggleMapExpand(): void {
    this.mapExpand = !this.mapExpand;
  }

  public updateBounds(place: google.maps.places.PlaceResult): void {
    this.zipPolygon.setMap(null);
    if (place.types.includes('postal_code')) {
      this.setZipCodeBoundaries(place);
    } else {
      this.map.fitBounds(place.geometry.viewport);
    }
  }

  public clusterTrackByFn(_index: number, cluster: SignCluster) {
    return `${cluster.lat}-${cluster.lon}`;
  }

  private setZipCodeBoundaries(place: google.maps.places.PlaceResult): void {
    const bounds = place.geometry.viewport;
    from(
      this.bingMapsService.getZipCoordinates(
        place.address_components[0].long_name
      )
    )
      .pipe(first())
      .subscribe((coordinateList: Coordinate[][]) => {
        _.forEach(coordinateList, (coordinates: Coordinate[]) => {
          if (coordinates.length > 0) {
            this.zipPolygon.setPaths(coordinates);
            this.zipPolygon.setMap(this.map);
            _.forEach(coordinates, (coordinate: Coordinate) => {
              const zipBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(coordinate.lat, coordinate.lng)
              );
              bounds.union(zipBounds);
            });
          }
        });
        this.map.fitBounds(bounds);
      });
  }
}
