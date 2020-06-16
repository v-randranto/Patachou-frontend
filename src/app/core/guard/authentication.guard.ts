import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authenticationService.isLoggedIn) {
      window.alert("Oups, il faut être connecté.e!");
      this.router.navigate(['login'])
    }
    return true;
    // const currentUser = this.authenticationService.currentUserValue;
    //     if (currentUser) {
    //         // logged in so return true
    //         return true;
    //     }
  }

}
