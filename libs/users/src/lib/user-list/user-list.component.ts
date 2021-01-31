import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  AppRoutes,
  Organization,
  Profile,
  User,
  UserService,
} from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() users: Array<User>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public canEdit: boolean;
  public dataSource = new MatTableDataSource<User>([]);
  public displayedColumns = ['name', 'email', 'roles', 'edit'];
  public orgOwnerId: string;
  public paginatorPageSizes = [10, 25, 50];
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.filterPredicate = this.filterPredicate;

    const orgSubscription = this.userService.$selectedOrganization.subscribe(
      async (organization: Organization) => {
        if (organization && organization.id) {
          this.orgOwnerId = organization.owner;
          setTimeout(() => {
            orgSubscription.unsubscribe();
          });
        }
      }
    );

    const currentUserSubscription = this.userService.$profile.subscribe(
      async (profile: Profile) => {
        if (profile && profile.user) {
          if (this.orgOwnerId && this.orgOwnerId === profile.user.id) {
            this.canEdit = true;
          } else {
            this.canEdit = false;
          }
        }
        setTimeout(() => {
          currentUserSubscription.unsubscribe();
        });
      }
    );
  }

  /**
   * Override default filter for Material Table
   * @param user
   * @param filterValue
   */
  private filterPredicate(user: User, filterValue: string): boolean {
    return user.first_name.toLowerCase().includes(filterValue);
  }

  /**
   * Override default sorting for Material Table columns
   * @param user
   * @param sortHeaderId
   */
  private sortingDataAccessor(user: User, sortHeaderId: string) {
    if (sortHeaderId === 'name') {
      return user['first_name'].toLowerCase();
    } else {
      return user[sortHeaderId];
    }
  }

  public edit(user: {
    first_name: string;
    last_name: string;
    email: string;
    roles: string[];
    id: string;
  }) {
    const url = AppRoutes.userDetails(user.id);
    this.router.navigateByUrl(url);
  }
}
