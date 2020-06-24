import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { SocketIoService } from '@app/core/service/socket-io.service';
import { Member } from '@app/data/model/member';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  // nombre de membres connectés
  public connectedNb;
  public currentMember = new Member();

  // menu
  public isMenuCollapsed = true;

  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketIoService
  ) { }

  ngOnInit(): void {
    // récup données du membre s'il est connecté
    if (this.authenticationService.isLoggedIn) {
        this.currentMember = this.authenticationService.userProfile;
    }
    // requêtes socket.io pour récupérer nombre de membres connectés
    this.socketService
      .getConnectionsNb()
      .subscribe((res) => {
        this.connectedNb = res;
      });

    this.socketService
      .disconnected()
      .subscribe((res) => {
        this.connectedNb++;
      });
  }

  ngOnDestroy(): void {
    this.socketService.getConnectionsNb().unsuscribe();
  }

  get isLoggedIn() {
    if (this.authenticationService.isLoggedIn) {
      this.currentMember = this.authenticationService.userProfile;
      return this.authenticationService.isLoggedIn;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.menuCollapse();
  }

  menuCollapse() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
