import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/data/model/user';
import { MemberDataService } from '@app/data/service/member-data.service';
import { SocketIoService } from './socket-io.service';
import { Observable } from 'rxjs';
import { Member } from '@app/data/model/member';
import { Relationship } from '@app/data/model/relationship';

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
    console.log('>authentService login user', user)
    localStorage.clear();
    console.log('> login localStorage cleared', localStorage)
    this.memberDataService.login(user)
      .subscribe((res) => {
        console.log('>login memberDataService.subcribe');
        this.socketService.connectMember({ id: res.id, pseudo: user.pseudo });
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user_id', res.id);
        console.log('> login localStorage set', localStorage)
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

  get userRelationships() {
    return JSON.parse(localStorage.getItem('user_relations'));
  }


  get isLoggedIn(): boolean {
    let token = localStorage.getItem('jwt_token');
    return (token !== null) ? true : false;
  }

  setUserProfile(member: Member) {
    localStorage.setItem('user_data', JSON.stringify(member));
  }

  setUserRelationships(relations: Relationship[]) {
    localStorage.setItem('user_relations', JSON.stringify(relations));
  }

  logout() {
    console.log('>logout localStorage before clearing', localStorage)
    localStorage.clear();
    this.socketService.disconnectMember();
    this.router.navigate(['home']);
  }
}
