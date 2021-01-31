import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewType } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class ViewTypeService {
  private campaignsType = new BehaviorSubject<ViewType>(ViewType.CARD);
  private adsType = new BehaviorSubject<ViewType>(ViewType.CARD);

  constructor() {}

  /**
   * Update the view type depending on the type
   * @param type the type you want to update (campaigns | ads)
   * @param value the new value
   */
  public updateType(type: string, value: ViewType): void {
    if (type === 'campaigns') {
      this.campaignsType.next(value);
    } else {
      this.adsType.next(value);
    }
  }

  /**
   * Allow for services/components to subscribe to type changes
   * @param type the type you want to subscribe to (campaigns | ads)
   */
  public type(type: string): Observable<ViewType> {
    if (type === 'campaigns') {
      return this.campaignsType.asObservable();
    } else {
      return this.adsType.asObservable();
    }
  }
}
