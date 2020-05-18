import { TokenData } from './../../data/model/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '@app/data/model/user';
import { MemberDataService } from '@app/data/service/member-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private memberDataService: MemberDataService, private router: Router) { }

  login(user: User) {
    this.memberDataService.login(user)
      .subscribe((res) => {
        const token = res.token;
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user_id', res.id);
        this.router.navigate(['profile']);
      },
        error => {
          console.error('Auth service : login KO', error);
          return error;
        });
  }

  getToken() {
    return localStorage.getItem('jwt_token');
  }

  getUserId() {
    return localStorage.getItem('user_id');
  }

  get isLoggedIn(): boolean {
    let token = localStorage.getItem('jwt_token');
    return (token !== null) ? true : false;
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    this.router.navigate(['home']);
  }
}
