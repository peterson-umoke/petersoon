import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdImage,
  AppRoutes,
  Organization,
  Profile,
  RouterService,
  UserService,
  VerificationsService,
} from '@marketplace/core';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public activeLinkIndex: number;
  public appRoutes = AppRoutes;
  public showLinks = false;
  public verificationsNeeded: number;

  constructor(
    private routerService: RouterService,
    public userService: UserService,
    private verificationsService: VerificationsService
  ) {
    this.subscriptions.add(
      this.verificationsService.$verifications.subscribe(
        (images: Array<AdImage>) => {
          this.verificationsNeeded = images.length;
        }
      )
    );
  }

  ngOnInit() {
    this.subscriptions.add(
      this.routerService.$route.subscribe((route: string) => {
        if (route) {
          setTimeout(() => {
            this.activeLink(route);
          });
        }
      })
    );

    this.subscriptions.add(
      this.userService.$selectedOrganization.subscribe((org: Organization) => {
        if (org) {
          this.verificationsService.getVerifications();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private activeLink(route: string): void {
    // Remove any query params
    route = route.split('?')[0];
    if (route.includes('campaign')) {
      this.activeLinkIndex = 0;
    } else if (route.includes('das')) {
      this.activeLinkIndex = 1;
    } else {
      this.activeLinkIndex = -1;
    }

    // Do not show links in register success page or create organization page on first organization
    // The user exists on this page but may not have verified their email address or created their first organization
    if (route.includes(AppRoutes.REGISTER_SUCCESS)) {
      this.showLinks = false;
    } else if (route.includes(AppRoutes.CREATE_ORGANIZATION)) {
      const subscription = this.userService.$profile.subscribe(
        (profile: Profile) => {
          this.showLinks = profile.organizations.length ? true : false;
          setTimeout(() => {
            subscription.unsubscribe();
          });
        }
      );
    } else {
      this.showLinks = true;
    }
  }
}
