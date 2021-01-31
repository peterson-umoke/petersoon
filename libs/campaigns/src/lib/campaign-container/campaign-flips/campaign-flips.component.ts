import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleMapConstants, SignAnalytics } from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-flips',
  templateUrl: './campaign-flips.component.html',
  styleUrls: ['./campaign-flips.component.scss'],
})
export class CampaignFlipsComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    mp: MatPaginator
  ) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @Input() signs: Array<SignAnalytics>;

  private paginator: MatPaginator;
  private sort: MatSort;

  public dataSource = new MatTableDataSource<SignAnalytics>([]);
  public displayedColumns = [
    'sign',
    'facing',
    'location',
    'blips',
    'est-impr',
    'spent',
    'impr-per-$',
  ];
  public map;
  public paginatorPageSizes = [5, 10, 25, 50];

  constructor(private media: MediaObserver) {}

  ngOnInit() {
    this.getDisplayedColumns();
    this.dataSource = new MatTableDataSource<SignAnalytics>(this.signs);
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.filterPredicate = this.filterPredicate;
    this.initHeatmap(this.mapElement);
  }

  /**
   * Override default filter for Material Table
   * @param sign
   * @param filterValue
   */
  private filterPredicate(sign: SignAnalytics, filterValue: string): boolean {
    if (sign.display_name) {
      return sign.display_name.toLowerCase().includes(filterValue);
    } else {
      return sign.name.toLowerCase().includes(filterValue);
    }
  }

  /**
   * Finds the smallest lat/lon bounds that include all the signs in the list.
   */
  private getBounds() {
    if (!this.signs || this.signs.length < 1) {
      return {
        nw: { lon: 0, lat: 0 },
        se: { lon: 0, lat: 0 },
      };
    }
    let min_lat = Infinity;
    let min_lon = Infinity;
    let max_lat = -Infinity;
    let max_lon = -Infinity;
    /**
     * top left = lat -lon
     * bottom right = -lat lon
     */
    this.signs.forEach((sign: SignAnalytics) => {
      if (sign.lat < min_lat) {
        min_lat = sign.lat;
      }
      if (sign.lat > max_lat) {
        max_lat = sign.lat;
      }
      if (sign.lon < min_lon) {
        min_lon = sign.lon;
      }
      if (sign.lon > max_lon) {
        max_lon = sign.lon;
      }
    });
    return {
      nw: { lon: min_lon, lat: max_lat },
      se: { lon: max_lon, lat: min_lat },
    };
  }

  /**
   * Finds the center of the smallest region that bounds all the signs in
   * the list.
   */
  private getCenter() {
    const bounds = this.getBounds();
    return new google.maps.LatLng(
      (bounds.nw.lat + bounds.se.lat) / 2,
      (bounds.nw.lon + bounds.se.lon) / 2
    );
  }

  /**
   * Changes columns to show for desktop / mobile
   */
  public getDisplayedColumns() {
    this.media.asObservable().subscribe((change: MediaChange[]) => {
      switch (change[0].mqAlias) {
        case 'xs':
          this.displayedColumns = [
            'sign',
            'blips',
            'est-impr',
            'spent',
            'impr-per-$',
          ];
          break;
        default:
          this.displayedColumns = [
            'sign',
            'facing',
            'location',
            'blips',
            'est-impr',
            'spent',
            'impr-per-$',
          ];
      }
    });
  }

  /**
   * Creates map Circle markers with varying sizes and locations
   */
  private getPoints() {
    const bounds = new google.maps.LatLngBounds();
    const maxFlips = this.signs.reduce((max: number, sign: SignAnalytics) => {
      return max > sign.flips ? max : sign.flips;
    }, 0);
    const signsLatLon = [];

    this.signs.forEach((sign) => {
      bounds.extend(new google.maps.LatLng(sign.lat, sign.lon));
      const size = 2 + (sign.flips / maxFlips) * 20;
      const icon: google.maps.Icon = {
        anchor: new google.maps.Point(size / 2, size / 2),
        scaledSize: new google.maps.Size(size, size),
        url:
          'https://blipbillboards-marketplace.s3.amazonaws.com/svg/circle.svg',
      };

      signsLatLon.push({
        location: new google.maps.Marker({
          position: new google.maps.LatLng(sign.lat, sign.lon),
          icon: icon,
          map: this.map,
        }),
      });
    });

    this.map.fitBounds(bounds);
    return signsLatLon;
  }

  /**
   * Creates map and adds heatmap layer
   * @param mapElement References #map in html
   */
  public initHeatmap(mapElement: ElementRef) {
    const mapProp: google.maps.MapOptions = GoogleMapConstants.HeatmapOptions;
    mapProp.center = this.getCenter();
    this.map = new google.maps.Map(mapElement.nativeElement, mapProp);
    this.map.layer = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
    });
  }

  /**
   * Sets Paginator once dataSource received
   */
  private setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Override default sorting for Material Table columns
   * @param sign
   * @param sortHeaderId
   */
  private sortingDataAccessor(sign: SignAnalytics, sortHeaderId: string) {
    if (sortHeaderId === 'sign') {
      if (sign.display_name) {
        return sign['display_name'].toLowerCase();
      } else if (sign.name) {
        return sign['name'].toLowerCase();
      }
    } else if (sortHeaderId === 'est-impr') {
      return sign.impressions;
    } else if (sortHeaderId === 'blips') {
      return sign.flips;
    } else if (sortHeaderId === 'spend') {
      return sign.spent;
    } else if (sortHeaderId === 'impr-per-$') {
      return sign.impressions / sign.spent;
    } else {
      return sign[sortHeaderId];
    }
  }
}
