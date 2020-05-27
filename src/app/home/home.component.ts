import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit(): void {

  }
}
