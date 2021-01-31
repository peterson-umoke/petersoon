import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { AppRoutes } from '../../enums';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { TranslationService } from '../../services/translation/translation.service';

const ERROR_CODES = [0, 401];

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBarService: SnackBarService,
    private translationService: TranslationService
  ) {}

  private checkStatus(err: HttpErrorResponse, subscriber: Subscriber<any>) {
    if (ERROR_CODES.includes(err.status)) {
      this.translationService
        .getTranslation('LOGIN.TO_CONTINUE')
        .subscribe((text: string) => {
          this.snackBarService.open(text);
        });

      // This prevents the login route routing to itself
      const returnUrl = this.router.routerState.snapshot.url;
      if (!returnUrl.includes('login')) {
        this.router.navigate([AppRoutes.LOGIN], {
          queryParams: { returnUrl: returnUrl },
        });
      }
    }

    subscriber.error(new Error(JSON.stringify(err.error)));
  }

  public delete(url: string): Observable<any> {
    const options = {
      withCredentials: true,
    };
    return new Observable((subscriber: Subscriber<any>) => {
      this.http.delete(url, options).subscribe(
        (response) => {
          subscriber.next(response);
        },
        (err) => {
          this.checkStatus(err, subscriber);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  }

  public get(url: string, params: string = ''): Observable<any> {
    const options = {
      params: new HttpParams({ fromString: params }),
      withCredentials: true,
    };
    return new Observable((subscriber: Subscriber<any>) => {
      this.http.get(url, options).subscribe(
        (response) => {
          subscriber.next(response);
        },
        (err) => {
          this.checkStatus(err, subscriber);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  }

  public patch(url: string, data: any): Observable<any> {
    const options = {
      withCredentials: true,
    };
    return new Observable((subscriber: Subscriber<any>) => {
      this.http.patch(url, data, options).subscribe(
        (response) => {
          subscriber.next(response);
        },
        (err) => {
          this.checkStatus(err, subscriber);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  }

  public post(url: string, data: any): Observable<any> {
    const options = {
      withCredentials: true,
    };
    return new Observable((subscriber: Subscriber<any>) => {
      this.http.post(url, data, options).subscribe(
        (response) => {
          subscriber.next(response);
        },
        (err) => {
          this.checkStatus(err, subscriber);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  }

  public put(url: string, data: any): Observable<any> {
    const options = {
      withCredentials: true,
    };
    return new Observable((subscriber: Subscriber<any>) => {
      this.http.put(url, data, options).subscribe(
        (response) => {
          subscriber.next(response);
        },
        (err) => {
          this.checkStatus(err, subscriber);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  }
}
