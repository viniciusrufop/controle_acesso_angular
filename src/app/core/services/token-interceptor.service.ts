import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { StorageKeys } from '../interfaces/storage-keys';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor{

  constructor(
    private injector : Injector,
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token: string = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);

    if (token) {
        request = request.clone({ setHeaders: { "Authorization": `bearer ${token}` } });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
          return event;
      }),
      catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
              this.authService.logoutUser();
          } else {
              console.log(error.error['message']);
          }
          return throwError(error);
      }));
  }

}
