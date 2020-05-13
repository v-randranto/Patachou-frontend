import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class MemberDataService {

  constructor(private http: HttpClient) { }

  // public getMembers(): Observable<Member[]> {
  //   const url = '/api/member/get';
  //   return this.http.get<Member[]>(url);
  // }
  // public getMember(): Observable<Member> {  // à corriger !!!
  //   const url = '/api/member/get';
  //   return this.http.post<Member>(url);
  // }

  public addMember(member: Member) {
    const url = '/api/member/add';
    return this.http.post<any>(url, member)
  }


  // public updateTool(member: Member) {
  //   const url = `api/member/update`;
  //   return this.http.put(url, member);
  // }

  // public deleteTool(memberId: number) {
  //   const url = `api/member/delete${memberId}`;
  //   return this.http.delete(url);
  // }

}
