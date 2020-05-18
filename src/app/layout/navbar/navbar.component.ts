import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  constructor(public authenticationService: AuthenticationService) { }

  logout() {
    this.authenticationService.logout();
  }

  ngOnInit(): void {
  }

}
