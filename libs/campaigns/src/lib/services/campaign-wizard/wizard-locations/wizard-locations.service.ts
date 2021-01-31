import { Injectable } from '@angular/core';
import {
  shareReplayRefCount,
  Sign,
  SignCluster,
  SignFilter,
} from '@marketplace/core';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject,
} from 'rxjs';
import { first, map, scan } from 'rxjs/operators';
import { CampaignWizardService } from '../campaign-wizard.service';

interface Clusters {
  [latLon: string]: SignCluster;
}

@Injectable()
export class WizardLocationsService {
  private allSigns$: Observable<Sign[]>;
  private selectedSigns$: Observable<Sign[]>;
  private selectedFilter = new BehaviorSubject(SignFilter.ALL);
  private mapBounds = new Subject<google.maps.LatLngBounds>();

  private changedSigns$: Observable<Sign[]>;
  private clusters$: Observable<Clusters>;
  private filteredSigns$: Observable<Sign[]>;

  public visibleClusters$: Observable<SignCluster[]>;
  public selectedClusters$: Observable<SignCluster[]>;
  public visibleSigns$: Observable<Sign[]>;
  public selectedFilter$: Observable<
    SignFilter
  > = this.selectedFilter.asObservable();

  constructor(private campaignWizardService: CampaignWizardService) {
    this.allSigns$ = this.campaignWizardService.signs$;
    this.selectedSigns$ = this.campaignWizardService.selectedSigns$;
    this.changedSigns$ = this.createChangedSignsObservable();
    this.clusters$ = this.createClustersObservable();
    this.filteredSigns$ = this.createFilteredSignsObservable();
    this.visibleSigns$ = this.createVisibleSignsObservable();
    this.visibleClusters$ = this.createVisibleClustersObservable();
    this.selectedClusters$ = this.createSelectedClustersObservable();
  }

  public updateMapBounds(bounds: google.maps.LatLngBounds): void {
    this.mapBounds.next(bounds);
  }

  public updateSelectedFilter(signFilter: SignFilter) {
    this.selectedFilter.next(signFilter);
  }

  private createChangedSignsObservable() {
    const initialSigns$ = this.allSigns$.pipe(first((s) => s.length > 0));
    return merge(
      initialSigns$,
      this.campaignWizardService.changedSigns$.asObservable()
    );
  }

  private createClustersObservable() {
    return this.changedSigns$.pipe(
      scan(
        (clusters, changedSigns) => {
          const updatedClusters = this.updateClustersForChangedSigns(
            clusters,
            changedSigns
          );
          return { ...clusters, ...updatedClusters };
        },
        {} as Clusters
      ),
      shareReplayRefCount(1)
    );
  }

  private updateClustersForChangedSigns(
    clusters: Clusters,
    changedSigns: Sign[]
  ) {
    const updatedClusters = {};
    _(changedSigns)
      .groupBy((sign) => this.clusterKey(sign))
      .forEach((signs, key) => {
        const existingCluster = clusters[key];
        updatedClusters[key] = this.createCluster(
          existingCluster ? existingCluster.signs : signs
        );
      });
    return updatedClusters;
  }

  private createFilteredSignsObservable(): Observable<Sign[]> {
    return combineLatest([
      this.selectedFilter$,
      this.allSigns$,
      this.selectedSigns$,
    ]).pipe(
      map(([selectedFilter, allSigns, selectedSigns]) => {
        switch (selectedFilter) {
          case SignFilter.ALL:
            return _.clone(allSigns);
          case SignFilter.SELECTED_SIGNS:
            return _.intersectionBy(allSigns, selectedSigns, 'id');
          case SignFilter.AVAILABLE:
            return _.filter(allSigns, ['booked', false]);
        }
      }),
      shareReplayRefCount(1)
    );
  }

  private createVisibleSignsObservable() {
    return combineLatest([this.filteredSigns$, this.mapBounds]).pipe(
      map(([filteredSigns, mapBounds]) => {
        return _.filter(filteredSigns, (s) =>
          mapBounds
            ? mapBounds.contains(new google.maps.LatLng(s.lat, s.lon))
            : true
        );
      }),
      shareReplayRefCount(1)
    );
  }

  private createVisibleClustersObservable(): Observable<SignCluster[]> {
    return combineLatest([this.visibleSigns$, this.clusters$]).pipe(
      map(([visibleSigns, clusters]) => {
        return _.intersectionWith(
          _.values(clusters),
          visibleSigns,
          (a: SignCluster, b: Sign) => {
            return parseFloat(a.lat) === b.lat && parseFloat(a.lon) === b.lon;
          }
        );
      }),
      shareReplayRefCount(1)
    );
  }

  public createSelectedClustersObservable(): Observable<SignCluster[]> {
    return combineLatest([this.clusters$, this.selectedSigns$]).pipe(
      map(([clusters, selectedSigns]) => {
        return _.filter(
          clusters,
          (cluster: SignCluster) =>
            _.intersectionBy(cluster.signs, selectedSigns, 'id').length > 0
        );
      })
    );
  }

  private createCluster(signs: Sign[]): SignCluster {
    const cluster = {
      signs: signs,
      lat: _.get(signs, '[0].lat'),
      lon: _.get(signs, '[0].lon'),
    } as SignCluster;
    cluster.icon = this.clusterIcon(cluster);
    return cluster;
  }

  private clusterIcon(cluster: SignCluster): { url: string; zIndex: number } {
    const selectedSignCount = _.filter(cluster.signs, 'selected').length;
    const unavailable = _.filter(cluster.signs, 'booked');
    if (
      cluster.signs.length > 0 &&
      unavailable.length / cluster.signs.length >= 0.5
    ) {
      return {
        url: `assets/map-markers/unavailable/${selectedSignCount}_${cluster.signs.length}.png`,
        zIndex: selectedSignCount,
      };
    } else {
      return {
        url: `assets/map-markers/available/${selectedSignCount}_${cluster.signs.length}.png`,
        zIndex: selectedSignCount,
      };
    }
  }

  private clusterKey(sign: Sign): string {
    return `${sign.lat}.${sign.lon}`;
  }
}
