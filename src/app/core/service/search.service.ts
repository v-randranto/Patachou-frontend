import { AuthenticationService } from './authentication.service';
import { MemberDataService } from './../../data/service/member-data.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';

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
    private authenticationService: AuthenticationService) {
    this.currentMemberId = this.authenticationService.userId;
  }
  // recherche après 400 ms d'inactivité suite à une saisie, on ne considère que le dernier résultat correspondant au dernier terme soumis
  search(terms: Observable<string>) {
    return terms.pipe(
      map(term => term.trim()),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    );
  }
  // l'id du membre qui fait la recherche est fourni afin de l'exclure des résultats
  searchEntries(term) {
    return this.memberDataService.searchMembers({ id: this.currentMemberId, term: term })
  }

}
