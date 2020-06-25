import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SocketIoService } from '@app/core/service/socket-io.service';
import { AuthenticationService } from '@core/service/authentication.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketIoService,
    private router: Router
  ) { }
  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      const member = this.authenticationService.userProfile;
      this.socketService.addMember(member);
    }
  }
}
