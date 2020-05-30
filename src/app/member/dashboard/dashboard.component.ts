import { Component, OnInit } from '@angular/core';
import { Member } from '@app/data/model/member';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public member: Member;

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      if (this.authenticationService.userProfile) {
        this.member = this.authenticationService.userProfile;
      } else {
        this.activatedRoute.data.subscribe((data: { member: Member }) => {
          if (data?.member) {
            this.member = data.member;
            this.authenticationService.setUserProfile(this.member);
          } else {
            this.authenticationService.logout();
            this.router.navigate(['home']);
          }
        });
      }
    } else {
      this.router.navigate(['home']);
    };
  }

}
