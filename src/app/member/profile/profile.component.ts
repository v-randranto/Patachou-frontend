import { Component, OnInit } from '@angular/core';
import { Member, Photo } from '@app/data/model/member';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AuthenticationService } from '@app/core/service/authentication.service';
@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
  public member: Member;
  public photo: Photo;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.member = this.authenticationService.userProfile;
    console.log('Member', this.member)
  }
  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
  }

}
