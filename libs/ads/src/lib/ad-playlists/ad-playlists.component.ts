import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  AppRoutes,
  FilterPipe,
  Playlist,
  PlaylistService,
  SearchService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-playlists',
  templateUrl: './ad-playlists.component.html',
  styleUrls: ['./ad-playlists.component.scss'],
})
export class AdPlaylistsComponent implements OnDestroy, OnInit {
  private allPlaylists: Playlist[];
  private search = '';
  private subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;

  public displayedColumns = ['art', 'name', 'num_of_ads', 'modified'];
  public dataSource = new MatTableDataSource<Playlist>();
  public filteredPlaylists: Playlist[] = [];
  public paginatorPageSizes = [10, 25, 50];

  constructor(
    private filterPipe: FilterPipe,
    public playlistService: PlaylistService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    const playlistSub = this.playlistService.$playlists.subscribe(
      (playlists: Playlist[]) => {
        if (playlists) {
          this.allPlaylists = playlists;
          this.dataSource = new MatTableDataSource<Playlist>(playlists);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort2;
          this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
          this.dataSource.filterPredicate = this.filterPredicate;
          this.applyFilter();
        }
      }
    );

    const searchServiceSub = this.searchService
      .type('ads')
      .subscribe((searchTerm: string) => {
        this.search = searchTerm;
        this.applyFilter();
      });

    this.subscriptions.push(playlistSub, searchServiceSub);
  }

  /**
   * Filter Material Table
   * @param filterValue
   */
  private applyFilter() {
    this.filteredPlaylists = this.filterPipe
      .transform(this.allPlaylists, 'name', this.search)
      .sort(this.sortPlaylists);
    this.dataSource.filter = this.search.trim().toLowerCase();
  }

  /**
   * Go to the edit playlist page when playlists are clicked
   * @param playlist
   */
  public details(playlist: Playlist) {
    this.router.navigate([AppRoutes.playlistDetails(playlist.id)]);
  }

  /**
   * Override default filter for Material Table
   * @param playlist
   * @param filterValue
   */
  private filterPredicate(playlist: Playlist, filterValue: string): boolean {
    return playlist.name.toLowerCase().includes(filterValue);
  }

  /**
   * Override default sorting for Material Table columns
   * @param ad
   * @param sortHeaderId
   */
  private sortingDataAccessor(playlist: Playlist, sortHeaderId: string) {
    if (sortHeaderId === 'name') {
      return playlist.name.toLowerCase();
    } else if (sortHeaderId === 'num_of_ads') {
      return playlist.ads.length;
    } else if (sortHeaderId === 'modified') {
      return playlist.modified;
    }
  }

  private sortPlaylists(p1: Playlist, p2: Playlist) {
    if (p1.name.toLowerCase() > p2.name.toLowerCase()) {
      return 1;
    } else if (p1.name.toLowerCase() < p2.name.toLowerCase()) {
      return -1;
    }
    return 0;
  }
}
