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
    const url = url_api + '/add';
    return this.http.post<any>(url, data)
  }

  public getAll(idObj: any): Observable<Relationship[]> {
    console.log(">relationData.getAll()")
    const url = url_api + '/getAll';
    return this.http.post<Relationship[]>(url, idObj)
  }

  public update(data: any): Observable<any> {
    const url = url_api + '/update';
    return this.http.post<any>(url, data)
  }

}
