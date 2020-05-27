import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { SocketIoService } from '@app/core/service/socket-io.service';
import { faPlug, faEnvelope, faSearch, faUserFriends, faPencilAlt, faUsers, faUser, faUserMinus, faUserPlus, faSignOutAlt, faSignInAlt, faInfoCircle, faSmileBeam, faAngleDown, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public connectedNb;
  public connectedLabel = 'connecté.es';
  public connectedIcon = faPlug;
  public searchIcon = faSearch;
  public friendsIcon = faUserFriends;
  public messagingIcon = faEnvelope;
  public postingIcon = faPencilAlt;
  public networkIcon = faUsers;
  public registerIcon = faUserPlus;
  public loginIcon = faSignInAlt;
  public logoutIcon = faSignOutAlt;
  public infoIcon = faInfoCircle;
  public aboutIcon = faSmileBeam;
  public submenuIcon = faCaretDown;
  public isMenuCollapsed = true;

  public networkMenu: string[] = [
    'Les zamis',
    'Les demandes de zamis reçus',
    'Les recommandations reçus'
  ];
  constructor(
    public authenticationService: AuthenticationService,
    private socketService: SocketIoService
  ) { }

  ngOnInit(): void {
    this.socketService
      .getConnectionsNb()
      .subscribe((res) => {
        this.connectedNb = res;
        console.log('>Socket getConnexion')
        if (this.connectedNb < 2) {
          this.connectedLabel = 'connecté.e'
        }
      });
  }

  ngOnDestroy(): void {
    this.socketService.getConnectionsNb().unsuscribe();
  }

  logout() {
    this.authenticationService.logout();
    this.isMenuCollapsed = !this.isMenuCollapsed
  }
  menuCollapse() {
    this.isMenuCollapsed = !this.isMenuCollapsed
  }
}
