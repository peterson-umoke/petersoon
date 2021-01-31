import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class TrackerApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Track an event in the DB
   * @param name The name of the tracker to be recorded under
   */
  public trackEvent(name: string): Observable<void> {
    return this.http
      .post(`${this.config.API_URL}/api/tracker/logs`, { name })
      .pipe(pluck('result'));
  }
}
