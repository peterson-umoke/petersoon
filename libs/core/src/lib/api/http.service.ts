import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { version } from '../../../../../package.json';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public delete(url: string): Observable<any> {
    return this.request('DELETE', url, {});
  }

  public get(url: string, params: string = '', options = {}): Observable<any> {
    const extra = {
      ...options,
      params: new HttpParams({ fromString: params }),
    };
    return this.request('GET', url, extra);
  }

  public patch(url: string, data: any): Observable<any> {
    return this.request('PATCH', url, { body: data });
  }

  public post(url: string, data: any, options = {}): Observable<any> {
    return this.request('POST', url, { body: data, ...options });
  }

  public put(url: string, data: any): Observable<any> {
    return this.request('PUT', url, { body: data });
  }

  public request(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    url: string,
    extra: any
  ): Observable<any> {
    return this.http.request(method, url, this.getOptions(extra));
  }

  private getOptions(extra?: any) {
    // May not need this for production code, if we are hosted on the same domain
    const options = _.omitBy(
      _.extend(
        {
          withCredentials: true,
        },
        extra
      ),
      _.isUndefined
    );
    _.set(options, 'headers.X-App', 'marketplace');
    _.set(options, 'headers.X-App-Version', version);
    return options;
  }
}
