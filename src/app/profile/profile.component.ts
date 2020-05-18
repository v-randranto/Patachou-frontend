import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MemberDataService } from '@app/data/service/member-data.service';
import { faMars, faVenus, faVenusMars, faBirthdayCake, faIdBadge, faInfoCircle, faSignInAlt, faSignOutAlt, faAt, faBinoculars, faEnvelope, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Member, Photo } from '@app/data/model/member';
import { ActivatedRoute, Router } from '@angular/router';
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
  public logoutIcon = faSignOutAlt;
  public friendsIcon = faUserFriends;
  public messageIcon = faEnvelope;
  public searchIcon = faBinoculars;

  constructor(private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {

  }
  ngOnInit(): void {

    if (this.authenticationService.isLoggedIn) {
      const id = this.authenticationService.getUserId();
      this.memberDataService.getProfile({ id }).subscribe(res => {
        this.member = res;
      },
        error => {
          console.error('profile appel member data ko', error);
        });
    } else {
      this.router.navigate(['home']);
    };






  }

  logout() {
    this.authenticationService.logout();
  }

}
