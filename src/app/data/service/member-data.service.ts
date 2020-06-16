
import { RegisterData } from './../model/member';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class MemberDataService {

  constructor(private http: HttpClient) { }

  public login(user: any): Observable<any> {
    const url = '/api/connection/login';
    return this.http.post<any>(url, user);
  }
  public getMember(idObj: any): Observable<Member> {
    const url = '/api/member/get';
    return this.http.post<Member>(url, idObj);
  }

  public searchMembers(): Observable<Member[]> {
    const url = '/api/member/search';
    return this.http.get<Member[]>(url);
  }

  public register(data: RegisterData): Observable<any> {
    const url = '/api/connection/register';
    return this.http.post<any>(url, data)
  }
}
