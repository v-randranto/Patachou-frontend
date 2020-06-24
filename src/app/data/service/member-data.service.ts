
import { RegisterData } from './../model/member';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member';

const url_connection = 'api/connection',
  url_member = 'api/member';

@Injectable({
  providedIn: 'root'
})

export class MemberDataService {

  constructor(private http: HttpClient) { }

  public login(user: any): Observable<any> {
    return this.http.post<any>(url_connection + '/login', user);
  }

  public register(data: RegisterData): Observable<any> {
    return this.http.post<any>(url_connection + '/register', data)
  }

  public lostPassword(data: any): Observable<any> {
    return this.http.post<any>(url_connection + '/password', data)
  }

  public getMember(idObj: any): Observable<Member> {
    return this.http.post<Member>(url_member + '/pseudo', idObj);
  }

  public searchMembers(data: any): Observable<Member[]> {
    return this.http.post<Member[]>(url_member + '/search', data);
  }

  public update(data: any): Observable<any> {
    return this.http.post<any>(url_member + '/update', data)
  }

}
