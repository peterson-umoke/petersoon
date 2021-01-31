import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppRoutes } from '../../enums';
import { OrganizationInfo } from '../../models';
import { UserService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class HasCampaignsGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkCanActivate(next, state);
  }

  private async checkCanActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const campaigns = await this.numberOfCampaigns();
    if (campaigns === 0) {
      // If the user has no campaigns, go straight to the create campaign page
      this.router.navigateByUrl(AppRoutes.NEW_CAMPAIGN_LOCATIONS);
      return Promise.resolve(false);
    }

    this.router.navigateByUrl(AppRoutes.CAMPAIGNS);
    return Promise.resolve(true);
  }

  /**
   * Get the number of campaigns for the organization from orgInfo
   */
  private async numberOfCampaigns(): Promise<number> {
    return new Promise((resolve) => {
      const selectedOrgInfoSubject = new Subject();
      this.userService.$selectedOrgInfo
        .pipe(takeUntil(selectedOrgInfoSubject))
        .subscribe((orgInfo: OrganizationInfo) => {
          if (orgInfo) {
            const numberOfCampaigns = Object.keys(
              orgInfo.campaigns || {}
            ).reduce((accumulator, key: string) => {
              return (
                accumulator +
                (orgInfo.campaigns[key] ? orgInfo.campaigns[key] : 0)
              );
            }, 0);
            selectedOrgInfoSubject.next();
            selectedOrgInfoSubject.complete();
            resolve(numberOfCampaigns);
          }
        });
    });
  }
}
