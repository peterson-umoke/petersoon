import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingArray: boolean[] = [];
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private loadingRedirect: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public $loading: Observable<boolean> = this.loading.asObservable();
  public $loadingRedirect: Observable<
    boolean
  > = this.loadingRedirect.asObservable();

  constructor() {}

  /**
   * Set if something is loading. Handles multiple loads
   * @param loading
   */
  public setLoading(loading: boolean): void {
    if (loading) {
      this.loadingArray.push(loading);
      this.set(true);
    } else {
      this.loadingArray.pop();
      if (!this.loadingArray.length) {
        this.set(false);
      }
    }
  }

  /**
   * Set loading redirect for the app
   * loading
   */
  public setLoadingRedirect(loading: boolean): void {
    if (loading) {
      this.loadingRedirect.next(true);
    } else {
      this.loadingRedirect.next(false);
    }
  }

  private set(value: boolean) {
    setTimeout(() => {
      this.loading.next(value);
    });
  }
}
