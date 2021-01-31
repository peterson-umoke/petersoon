// JWT Interceptor
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceLib } from '@marketplace/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthServiceLib) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handle(request, next));
  }

  private async handle(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    // S3 does not handle authorization header
    if (
      !request.url.includes(
        'https://blipbillboards-marketplace.s3.amazonaws.com'
      )
    ) {
      try {
        const user = await this.authService.loggedIn();
        const token = await user.getIdToken();
        request = request.clone({
          setHeaders: {
            Authorization: `JWT ${token}`,
            Version: environment.version,
          },
        });
      } finally {
        return next.handle(request).toPromise();
      }
    }

    return next.handle(request).toPromise();
  }
}
