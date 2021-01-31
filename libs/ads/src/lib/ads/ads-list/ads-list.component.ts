import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ad, FilterPipe, SearchService } from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss'],
})
export class AdsListComponent implements OnChanges, OnDestroy, OnInit {
  private subscriptions: Subscription = new Subscription();

  @Input() ads: Array<Ad>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns = ['art', 'ad', 'num_of_ads', 'uploaded'];
  public dataSource = new MatTableDataSource<Ad>([]);
  public filteredAds: Array<Ad>;
  public paginatorPageSizes = [10, 25, 50];

  constructor(
    private filterPipe: FilterPipe,
    private searchService: SearchService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<Ad>(this.ads);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.filterPredicate = this.filterPredicate;

    this.subscriptions.add(
      this.searchService.type('ads').subscribe((term: string) => {
        this.applyFilter(term);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Filter Material Table
   * @param filterValue
   */
  private applyFilter(filterValue: string) {
    this.filteredAds = this.filterPipe.transform(this.ads, 'name', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Override default filter for Material Table
   * @param ad
   * @param filterValue
   */
  private filterPredicate(ad: Ad, filterValue: string): boolean {
    return ad.name.toLowerCase().includes(filterValue);
  }

  /**
   * Override default sorting for Material Table columns
   * @param ad
   * @param sortHeaderId
   */
  private sortingDataAccessor(ad: Ad, sortHeaderId: string) {
    if (sortHeaderId === 'ad') {
      return ad.name.toLowerCase();
    } else if (sortHeaderId === 'num_of_ads') {
      return ad.images.length;
    } else if (sortHeaderId === 'uploaded') {
      return ad.created;
    }
  }
}
