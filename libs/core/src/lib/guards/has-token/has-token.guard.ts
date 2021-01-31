import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthAPIService } from '../../api/auth/auth-api.service';
import { AppRoutes } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class HasTokenGuard implements CanActivate {
  constructor(private authApiService: AuthAPIService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkCanActivate(next, state);
  }

  public canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.checkCanActivate(route, state);
  }

  private checkCanActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.authApiService
        .checkLogin(route)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          this.router.navigate([AppRoutes.LOGIN], {
            queryParams: { returnUrl: state.url },
          });
          resolve(false);
        });
    });
  }
}
