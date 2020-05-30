import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MemberDataService } from '@app/data/service/member-data.service';
import { Member } from '@app/data/model/member';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public members = [];
  public searchTerm = new Subject<string>();
  public searchResults: any;
  public loading: boolean;

  constructor(private http: HttpClient) {
  }

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    );
  }
  searchEntries(term) {
    console.log('searchEntries term', term)
    return this.http.post(`/api/member/search`, {term: term});
  }

}
