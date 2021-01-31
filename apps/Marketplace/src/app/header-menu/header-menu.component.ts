import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AdImage,
  AppRoutes,
  AuthAPIService,
  OrganizationInfo,
  UserService,
  VerificationsService,
} from '@marketplace/core';
import { Intercom } from 'ng-intercom';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  @Input() showLinks: boolean;

  private subscriptions: Subscription = new Subscription();

  public appRoutes = AppRoutes;
  public canAddUsers: boolean;
  public verificationsNeeded: number;

  constructor(
    private authApiService: AuthAPIService,
    private intercom: Intercom,
    private router: Router,
    public userService: UserService,
    private verificationsService: VerificationsService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.verificationsService.$verifications.subscribe(
        (images: Array<AdImage>) => {
          this.verificationsNeeded = images.length;
        }
      )
    );
    this.subscriptions.add(
      this.userService.$selectedOrgInfo.subscribe(
        (orgInfo: OrganizationInfo) => {
          if (orgInfo) {
            this.canAddUsers = orgInfo.permissions.indexOf('manage_users') > -1;
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public logout() {
    this.authApiService.logout().then(() => {
      this.router.navigateByUrl(AppRoutes.LOGIN);
    });
  }

  public openIntercom() {
    this.intercom.show();
  }
}
