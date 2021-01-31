import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import {
  Ad,
  AdImage,
  ApiResponse,
  PopReportAd,
  ResizeImage,
  Resolution,
} from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class AdApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Approve image verification
   * imageIds
   */
  public approveVerification(imageIds: Array<string>): Observable<any> {
    return this.http
      .post(`${this.config.API_URL}/api/da/verify-images`, imageIds)
      .pipe(pluck('result'));
  }

  /**
   * Resize Ad images
   * If dryrun, will not resize, but will return what sizes can or cannot be resized
   * If not dryrun, will resize images if possible
   * @param ads ads that are part of the campaign
   * @param signs signs that are part of the campaign
   * @param dryrun signifies whether or not to actually queue up resizing
   */
  public backgroundResizeImage(
    ads: Array<string>,
    signs: Array<string>,
    dryrun: boolean = true
  ): Observable<Array<ResizeImage>> {
    return this.http
      .post(`${this.config.API_URL}/api/da/resize-ad/`, {
        ads,
        signs,
        dryrun,
      })
      .pipe(pluck('result'));
  }

  /**
   * Delete an Ad
   * adId
   */
  public delete(adId: string): Observable<ApiResponse> {
    return this.http.delete(`${this.config.API_URL}/api/da/${adId}`);
  }

  /**
   * Delete ad image
   * imageId
   */
  public deleteImage(imageId: string): Observable<ApiResponse> {
    return this.http.delete(`${this.config.API_URL}/api/da/image/${imageId}`);
  }

  /**
   * Force resize of an Ad image
   * @param overwrite optional
   */
  public forceResizeImage(
    adId: string,
    size: Resolution,
    overwrite: boolean = false
  ): Observable<Ad> {
    return this.http
      .get(
        `${this.config.API_URL}/api/da/resize_image/${adId}`,
        `height=${size.height}&width=${size.width}&overwrite=${overwrite}`
      )
      .pipe<Ad>(pluck('result'));
  }

  /**
   * Get an Ad
   * @param adId Ad id to get
   */
  public get(adId: string): Observable<Ad> {
    return this.http
      .get(`${this.config.API_URL}/api/da/${adId}`)
      .pipe<Ad>(pluck('result'));
  }

  /**
   * Get Ads to run a pop report for
   * @param orgId Organization id for ads to get
   */
  public getPopReportAds(orgId: string): Observable<Array<PopReportAd>> {
    return this.http
      .get(`${this.config.API_URL}/api/da/pop-list`, `org=${orgId}`)
      .pipe(pluck('result'));
  }

  /**
   * Get images that need verification
   * orgId
   */
  public getVerifications(orgId: string): Observable<Array<AdImage>> {
    return this.http
      .get(`${this.config.API_URL}/api/da/verify-images`, `org_id=${orgId}`)
      .pipe(pluck('result'));
  }

  /**
   * Query for a list of Ads for an organization
   * orgId
   */
  public organizationAds(orgId: string): Observable<Ad[]> {
    return this.http
      .get(
        `${this.config.API_URL}/api/da/list`,
        `org=${orgId}&excludeModeration`
      )
      .pipe<Ad[]>(pluck('result'));
  }

  /**
   * Get the ratings for an Ad
   * adId
   */
  public ratings(adId: string): Observable<any> {
    return this.http
      .get(`${this.config.API_URL}/api/da/${adId}/ratings`)
      .pipe(pluck('result'));
  }

  /**
   * Resize Ad images
   * If dryrun, will not resize, but will return what sizes can or cannot be resized
   * If not dryrun, will resize images if possible
   * ad
   * sizes
   * @param dryrun optional
   */
  public resizeImage(
    ad: Ad,
    sizes: Array<Resolution>,
    dryrun: boolean = true
  ): Observable<Array<ResizeImage>> {
    return this.http
      .post(`${this.config.API_URL}/api/da/resize-ad/${ad.id}`, {
        id: ad.id,
        sizes,
        dryrun,
      })
      .pipe(pluck('result'));
  }

  /**
   * Save a new Ad
   * @param ad the new Ad
   * orgId
   */
  public save(ad: Ad, orgId: string): Observable<Ad> {
    ad.organization = orgId;
    return this.http
      .post(`${this.config.API_URL}/api/da/`, ad)
      .pipe(pluck('result'));
  }

  /**
   * Update an Ad
   * @param id Ad id to update
   */
  public update(ad: Ad): Observable<Ad> {
    return this.http
      .put(`${this.config.API_URL}/api/da/${ad.id}`, ad)
      .pipe(pluck('result'));
  }
}
