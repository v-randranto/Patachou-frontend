import { LoginData } from './../../data/model/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '@app/data/model/member';
import { MemberDataService } from '@app/data/service/member-data.service';
import { SocketIoService } from './socket-io.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Relationship } from '@app/data/model/relationship';
import { User } from '@app/data/model/user';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(
    private memberDataService: MemberDataService,
    private router: Router,
    private socketService: SocketIoService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user_data')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginData) {

    return this.memberDataService.login(loginData)
      .pipe(map(data => {
        console.log('>login memberDataService.subcribe member', data);
        const user = {
          member: data.member,
          token: data.token
        }
        this.socketService.connectMember({ id: JSON.stringify(data.member._id), pseudo: data.member.pseudo });
        localStorage.setItem('user_data', JSON.stringify(user));
        console.log('> login localStorage set', localStorage);
        console.log('user', user);
        return user;
      }));
  }

  logout() {
    localStorage.clear();
    this.socketService.disconnectMember();
    this.router.navigate(['home']);
    // this.currentUserSubject.next(null);
  }

  get token() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.token;
  }

  get userId() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.member._id;
  }

  get userProfile() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.member;
  }

  get userRelationships() {
    return JSON.parse(localStorage.getItem('user_relations'));
  }

  get isLoggedIn(): boolean {
    return (localStorage.getItem('user_data')) ? true : false;
  }

  setUserRelationships(relations: Relationship[]) {
    localStorage.setItem('user_relations', JSON.stringify(relations));
  }

}
