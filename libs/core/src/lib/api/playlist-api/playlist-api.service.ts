import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { ApiResponse, Playlist } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Get playlists for an organization
   * orgId
   */
  public allPlaylists(orgId: string): Observable<Array<Playlist>> {
    return this.http
      .get(`${this.config.API_URL}/api/da/group/list`, `org=${orgId}`)
      .pipe(pluck('result'));
  }

  /**
   * Create a playlist for an organization
   * orgId
   * playlist
   */
  public createPlaylist(orgId: string, playlist: Playlist): Observable<any> {
    playlist.organization = orgId;
    return this.http
      .post(`${this.config.API_URL}/api/da/group/`, playlist)
      .pipe(pluck('result'));
  }

  /**
   * Delete a playlist
   * id
   */
  public deletePlaylist(id: string): Observable<ApiResponse> {
    return this.http.delete(`${this.config.API_URL}/api/da/group/${id}`);
  }

  /**
   * Get a playlist
   * id
   */
  public getPlaylist(id: string): Observable<any> {
    return this.http
      .get(`${this.config.API_URL}/api/da/group/${id}`)
      .pipe(pluck('result'));
  }

  /**
   * Update a playlist
   * playlist
   */
  public updatePlaylist(playlist: Playlist): Observable<any> {
    return this.http
      .put(`${this.config.API_URL}/api/da/group/${playlist.id}`, playlist)
      .pipe(pluck('result'));
  }
}
