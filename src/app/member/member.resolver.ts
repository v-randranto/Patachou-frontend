import { AuthenticationService } from '@core/service/authentication.service';
import { Member } from '@app/data/model/member';
import { MemberDataService } from '../data/service/member-data.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class MemberResolver implements Resolve<Member> {
  constructor(
    private memberDataService: MemberDataService,
    private authenticationService: AuthenticationService) { }

  resolve(): Observable<Member> {
    const id = this.authenticationService.userId;
    return this.memberDataService.getMember({id: id})
  }
}
