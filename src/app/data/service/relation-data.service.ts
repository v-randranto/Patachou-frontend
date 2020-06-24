import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelationForm, Relationship } from '../model/relationship';

const url_api = '/api/relation';

@Injectable({
  providedIn: 'root'
})

export class RelationDataService {

  constructor(private http: HttpClient) { }

  public add(data: RelationForm): Observable<any> {
    return this.http.post<any>(url_api + '/add', data)
  }

  public getAll(idObj: any): Observable<Relationship[]> {
    return this.http.post<Relationship[]>(url_api + '/getAll', idObj)
  }

  public update(data: any): Observable<any> {
    return this.http.post<any>(url_api + '/update', data)
  }

}
