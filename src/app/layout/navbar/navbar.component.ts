import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { SocketIoService } from '@app/core/service/socket-io.service';
import { Member } from '@app/data/model/member';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  // nombre de membres connectés
  public loggedInNb;
  public currentMember = new Member();
  public socketSubscription : Subscription;

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
    this.socketSubscription = this.socketService
      .getLoggedInNb()
      .subscribe((res) => {
        this.loggedInNb = res;
      });

  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
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
