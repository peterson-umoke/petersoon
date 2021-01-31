import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { Profile, User } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Get user Profile
   */
  public get(): Observable<Profile> {
    return this.http
      .get(`${this.config.API_URL}/api/account/login/`)
      .pipe(pluck('result'));
  }

  /**
   * Update a users profile
   * user
   */
  public update(user: User): Observable<User> {
    return this.http
      .put(`${this.config.API_URL}/api/account/profile/`, user)
      .pipe(pluck('result'));
  }
}
