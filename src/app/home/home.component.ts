import { Component, OnInit } from '@angular/core';
import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public connectedNb = 0;
  public connectedIcon = faPlug;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['profile']);
    };
  }
}
