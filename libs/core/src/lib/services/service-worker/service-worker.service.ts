import { ApplicationRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  constructor(
    private appRef: ApplicationRef // private serviceWorkerUpdate: SwUpdate,
  ) {
    // if (this.serviceWorkerUpdate.isEnabled) {
    //   const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    //   const everySixHours$ = interval(6 * 60 * 60 * 1000);
    //   const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    //   everySixHoursOnceAppIsStable$.subscribe(() => this.serviceWorkerUpdate.checkForUpdate());
    // }
  }

  /**
   * Check to see if there is an update available for the service worker
   * If there is, show a snack bar alert to refresh the page
   */
  public checkForUpdate() {
    // Make sure to unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    // this.serviceWorkerUpdate.available.subscribe((event: UpdateAvailableEvent) => {
    //   window.location.reload();
    // });
  }
}
