import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MemberDataService } from '@app/data/service/member-data.service';
import { faMars, faVenus, faVenusMars, faBirthdayCake, faIdBadge, faInfoCircle, faAt } from '@fortawesome/free-solid-svg-icons';
import { Member, Photo } from '@app/data/model/member';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    if (this.authenticationService.isLoggedIn) {
      if (localStorage.getItem('user_data') && localStorage.getItem('user_id')) {
        this.member = JSON.parse(localStorage.getItem('user_data'));
      } else {
        this.activatedRoute.data.subscribe((data: { member: Member }) => {
          if (data?.member) {
            this.member = data.member;
            localStorage.setItem('user_data', JSON.stringify(this.member))
          } else {
            this.authenticationService.logout();
            this.router.navigate(['home']);
          }
        });
      }
    } else {
      this.router.navigate(['home']);
    };
  }

}
