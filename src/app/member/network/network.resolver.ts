import { AuthenticationService } from '@core/service/authentication.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RelationDataService } from '@app/data/service/relation-data.service';

@Injectable()
export class NetworkResolver implements Resolve<any> {
  constructor(
    private authenticationService: AuthenticationService,
    private relationDataService: RelationDataService
    ) { }

  resolve(): Observable<any> {
    console.log(">networkResolver")
    const id = this.authenticationService.userId;
    return this.relationDataService.getAll({ id });
  }
}
