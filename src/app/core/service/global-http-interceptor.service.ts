import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenticationService.isLoggedIn) {
      const token = this.authenticationService.token;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        console.error('intercept http error', err.error);
        if (this.authenticationService.isLoggedIn) {
          if (err.status === 401) {
            this.authenticationService.logout();
            location.reload(true);
          }
        }
        if (err.error.loginStatus ) {
          return throwError(err.error.loginStatus)
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    )
  }
}

