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
  ) {
    if (this.authenticationService.isLoggedIn) {
      this.member = this.authenticationService.userProfile;
      // this.member = this.authenticationService.currentUserValue.member;
      console.log('member', this.member)

    } else {
      console.log('redirect home')
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void {

  }

}
