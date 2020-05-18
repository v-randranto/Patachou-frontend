import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member';
import { TokenData } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class MemberDataService {

  constructor(private http: HttpClient) { }

  public login(user: any): Observable<TokenData> {
    const url = '/api/connection/login';
    return this.http.post<TokenData>(url, user);
  }
  public getProfile(id: any): Observable<Member> {
    const url = '/api/profile/get';
    return this.http.post<Member>(url, id);
  }

  public register(member: Member): Observable<any> {
    const url = '/api/connection/register';
    return this.http.post<any>(url, member)
  }

}
