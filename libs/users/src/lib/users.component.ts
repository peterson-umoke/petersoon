import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes, Organization, UserService } from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public users;

  constructor(private router: Router, private userService: UserService) {}

  async ngOnInit() {
    const subscription = this.userService.$selectedOrganization.subscribe(
      async (organization: Organization) => {
        if (organization) {
          setTimeout(() => {
            subscription.unsubscribe();
          });
          this.users = await this.userService.getUsersFromOrg(organization.id);
          // Sorts Users by first name
          this.users.result = this.users.result.sort((a, b) =>
            a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
          );
        }
      }
    );
  }

  /**
   * Adds a new user on the current organization
   */
  public newUser() {
    this.router.navigate([AppRoutes.USERS_NEW]);
  }
}
