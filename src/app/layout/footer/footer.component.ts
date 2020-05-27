import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { faMars, faVenus, faVenusMars, faBirthdayCake, faIdBadge, faInfoCircle, faSignInAlt, faSignOutAlt, faAt, faBinoculars, faEnvelope, faUserFriends } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public logoutIcon = faSignOutAlt;
  public friendsIcon = faUserFriends;
  public messageIcon = faEnvelope;
  public searchIcon = faBinoculars;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authenticationService.logout();
  }

}
