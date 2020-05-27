import { AuthenticationService } from './../../core/service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { User } from '@app/data/model/user';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public submitted = false;
  public badCredentials = false;
  public technicalFailure = false;
  public user: User;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['profile']);
    };
    this.loginForm = this.fb.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.user = this.loginForm.value;
    this.user.pseudo = this.loginForm.value.pseudo.toLowerCase();
    // TODO gestion retour KO
    try {
      this.authenticationService.login(this.user);
    } catch (error) {
      console.log('erreur auth', error)
    }

  }
}
