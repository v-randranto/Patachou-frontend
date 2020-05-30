import { Component, OnInit } from '@angular/core';
import { faMars, faVenus, faVenusMars, faBirthdayCake, faIdBadge, faInfoCircle, faAt } from '@fortawesome/free-solid-svg-icons';
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
  public nameIcon = faIdBadge;
  public aboutMeIcon = faInfoCircle;
  public femaleIcon = faVenus;
  public maleIcon = faMars;
  public otherIcon = faVenusMars;
  public birthDateIcon = faBirthdayCake;
  public emailIcon = faAt;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    if (this.authenticationService.userProfile) {
      this.member = this.authenticationService.userProfile;
    } else {
      this.authenticationService.logout();
      this.router.navigate(['home']);
    }
  }

}
