import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../models/environment';
import { LoadingService } from '../../services/loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class ScraperApiService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private environment: Environment
  ) {}

  public scrape(url): Promise<any> {
    this.loadingService.setLoading(true);

    let api = '';
    let xpath = false;
    if (url.xpath || url.selectedXpath) {
      if (url.xpath) {
        url.path = url.xpath;
      } else {
        url.path = url.selectedXpath;
      }
      xpath = true;
      api = 'scrape/';
      url.timeout = url.stale_time;
    } else {
      api = 'search/';
    }

    return new Promise((resolve, reject) => {
      this.http.post(`${this.environment.SCRAPER_URL}/${api}`, url).subscribe(
        (resp) => {
          this.loadingService.setLoading(false);
          resolve({ isXpath: xpath, paths: resp['result'] });
        },
        (err) => {
          const errMessage = this.errorMessage(err);
          this.loadingService.setLoading(false);
          reject(errMessage);
        }
      );
    });
  }

  private errorMessage(err): string {
    if (!err.error) {
      return 'Internal Server Error';
    }
    if (!err.error.errors) {
      return 'Internal Server Error';
    }
    if (err.error.errors[0]) {
      return err.error.errors[0];
    }
    if (err.error.errors.url) {
      return err.error.errors.url[0];
    }
    if (err.error.errors.value) {
      return err.error.errors.value[0];
    }
    return 'Internal Server Error';
  }
}
