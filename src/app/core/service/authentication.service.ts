import { LoginData } from './../../data/model/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '@app/data/model/member';
import { MemberDataService } from '@app/data/service/member-data.service';
import { SocketIoService } from './socket-io.service';
import { BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Relationship } from '@app/data/model/relationship';
import { User } from '@app/data/model/user';

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
        const user = {
          member: data.member,
          token: data.token,
          tokenExpDate: Date.now() + data.expiresIn - (60 * 1000)
        }
        this.socketService.addMember(data.member);
        localStorage.setItem('user_data', JSON.stringify(user));
        return user;
      }));
  }

  logout() {
    localStorage.clear();
    this.socketService.subtractMember();
    this.router.navigate(['home']);
  }

  get token() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.token;
  }

  get tokenExpDate() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.tokenExpDate;
  }

  get userId() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.member._id;
  }

  get userProfile() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    return userData.member;
  }

  get isLoggedIn(): boolean {
    return (localStorage.getItem('user_data')) ? true : false;
  }

  setUserProfile(member: Member) {
    localStorage.setItem('user_data', JSON.stringify(member));
  }

}
