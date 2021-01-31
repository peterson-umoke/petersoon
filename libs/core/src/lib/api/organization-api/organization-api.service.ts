import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { BLIP_CONFIG, Config } from '../../core.config';
import { Organization, OrganizationInfo } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationApiService {
  constructor(
    @Inject(BLIP_CONFIG) private config: Config,
    private http: HttpService
  ) {}

  /**
   * Create an organization
   */
  public create(form: {
    name: string;
    political: boolean;
  }): Observable<Organization> {
    return this.http
      .post(`${this.config.API_URL}/api/account/organization/`, form)
      .pipe(pluck('result'));
  }

  /**
   * Get an organization
   */
  public get(organizationId: string): Observable<Organization> {
    return this.http
      .get(`${this.config.API_URL}/api/account/organization/${organizationId}/`)
      .pipe(pluck('result'));
  }

  /**
   * Get an organization's information
   * organizationId
   */
  public getInfo(organizationId: string): Observable<OrganizationInfo> {
    return this.http
      .get(
        `${this.config.API_URL}/api/account/organization/${organizationId}/info/`
      )
      .pipe(pluck('result'));
  }

  /**
   * Delete an organization
   * organizationId
   */
  public delete(organizationId: string): Observable<any> {
    return this.http.delete(
      `${this.config.API_URL}/api/account/organization/${organizationId}`
    );
  }

  /**
   * Update an organization
   * organization
   */
  public update(organization: Organization): Observable<Organization> {
    return this.http
      .put(
        `${this.config.API_URL}/api/account/organization/${organization.id}`,
        organization
      )
      .pipe(pluck('result'));
  }
}
