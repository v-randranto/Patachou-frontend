import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/data/model/user';
import { MemberDataService } from '@app/data/service/member-data.service';
import { SocketIoService } from './socket-io.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private memberDataService: MemberDataService,
    private router: Router,
    private socketService: SocketIoService
  ) { }

  login(user: User) {
    console.log('>login', user)
    localStorage.clear();
    console.log('> login', localStorage)
    this.memberDataService.login(user)
      .subscribe((res) => {
        console.log('>login ok, connectMember')
        this.socketService.connectMember({ id: res.id, pseudo: user.pseudo });
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user_id', res.id);
        this.router.navigate(['member/dashboard']);
      },
        error => {
          console.error('Auth service : login KO', error);
          throw error;
        });
  }

  getToken() {
    return localStorage.getItem('jwt_token');
  }

  get userId() {
    return localStorage.getItem('user_id');
  }
  get userProfile() {
    return JSON.parse(localStorage.getItem('user_data'));
  }


  get isLoggedIn(): boolean {
    let token = localStorage.getItem('jwt_token');
    return (token !== null) ? true : false;
  }

  setUserProfile(member) {

    localStorage.setItem('user_data', JSON.stringify(member));
  }

  logout() {
    localStorage.clear();
    console.log('logout', localStorage)
    this.socketService.disconnectMember();
    this.router.navigate(['home']);
  }
}
