import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler } from '@angular/common/http/http';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
      const jwtToken = this.authenticationService.getToken();
      req = req.clone({
          setHeaders: {
              Authorization: "Bearer " + jwtToken
          }
      });
      return next.handle(req);
  }
}
