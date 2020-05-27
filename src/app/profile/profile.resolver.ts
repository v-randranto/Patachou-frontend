import { map } from 'rxjs/operators';
import { Member } from '@app/data/model/member';
import { MemberDataService } from './../data/service/member-data.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class ProfileResolver implements Resolve<Member> {
  constructor(private memberDataService: MemberDataService, private router: Router) { }

  resolve(): Observable<Member> {
    const id = localStorage.getItem('user_id');
    console.log('Resolving for member id:' + id);
    return this.memberDataService.getProfile({id: id})
  }
}
