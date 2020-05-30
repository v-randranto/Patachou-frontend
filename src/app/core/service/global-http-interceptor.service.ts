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
    const jwtToken = this.authenticationService.getToken();
    request = request.clone({
      setHeaders: {
        Authorization: "Bearer " + jwtToken
      }
    });

    return next.handle(request).pipe(
      catchError((error) => {
        console.error(error);
        // login non autorisé
        if (error.status === 401) {
          // jeton expiré, il faut déconnecter l'utilisteur
          if (this.authenticationService.isLoggedIn) {
            console.log('à déconnecter')
            this.authenticationService.logout();
            // location.reload(true);
          }
        }
  
        this.router.navigate(['connection/login']);
        return throwError(error);
      })
    )
  }
}

