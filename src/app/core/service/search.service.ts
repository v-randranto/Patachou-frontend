import { AuthenticationService } from './authentication.service';
import { MemberDataService } from './../../data/service/member-data.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public members = [];
  public searchTerm = new Subject<string>();
  public searchResults: any;
  public currentMemberId: any;

  constructor(
    private memberDataService: MemberDataService,
    private authenticationService: AuthenticationService)
    {
      // il faut exclure le membre qui fait la recherche des résultats
      this.currentMemberId = this.authenticationService.userId;
  }

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    );
  }
  searchEntries(term) {
    return this.memberDataService.searchMembers({id: this.currentMemberId, term: term})
  }

}
