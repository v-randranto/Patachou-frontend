import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const url_api = '/api/contact';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  public send(data: any): Observable<any> {
    return this.http.post<any>(url_api + '/email', data)
  }
}
