import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';


import { Router } from '@angular/router';

@Component({
  templateUrl: './logout.component.html'
})

export class LogoutComponent {
  constructor(private authenticationService: AuthenticationService) { }
  logout() {
    this.authenticationService.logout();
  }
}
