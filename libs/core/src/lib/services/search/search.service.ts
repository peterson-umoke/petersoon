import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private campaignsTerm = new BehaviorSubject<string>('');
  private adsTerm = new BehaviorSubject<string>('');

  constructor() {}

  /**
   * Update the search term depending on type
   * @param type the type you want to update (campaigns | ads)
   * @param term
   */
  public setSearchTerm(type: string, term: string): void {
    if (type === 'campaigns') {
      this.campaignsTerm.next(term);
    } else {
      this.adsTerm.next(term);
    }
  }

  /**
   * Allow for services/components to subscribe to search term changes
   * @param type the type you want to subscribe to (campaigns | ads)
   */
  public type(type: string): Observable<string> {
    if (type === 'campaigns') {
      return this.campaignsTerm.asObservable();
    } else {
      return this.adsTerm.asObservable();
    }
  }
}
