import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { faSignInAlt, faSignOutAlt, faAt, faBinoculars, faEnvelope, faUserFriends } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortcutComponent implements OnInit {
  public isLoggedIn = false;
  public logoutIcon = faSignOutAlt;
  public friendsIcon = faUserFriends;
  public messageIcon = faEnvelope;
  public searchIcon = faBinoculars;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isLoggedIn;
  }

  logout() {
    this.authenticationService.logout();
  }

}
