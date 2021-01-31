import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { Points, Sign, SignSizes } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class SignApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Get all Signs
   */
  public geoQuery(points: Points = null): Observable<Array<Sign>> {
    return this.http
      .get(
        `${this.config.API_URL}/api/sign/geo`,
        points ? `pt1=${points.pt1}&pt2=${points.pt2}` : ''
      )
      .pipe(pluck('result'));
  }

  /**
   * Get a list of sign sizes and the number of duplicates
   */
  public signSizes(signs: Array<string>): Observable<Array<SignSizes>> {
    return this.http
      .get(`${this.config.API_URL}/api/sign/resolutions/${signs.join(',')}`)
      .pipe(pluck('result'));
  }
}
