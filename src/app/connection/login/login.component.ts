import { AuthenticationService } from './../../core/service/authentication.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '@app/data/model/user';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('error') errorRef: TemplateRef<any>;
  public modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    ignoreBackdropClick: true
  };

  public loginForm: FormGroup;
  public submitted = false;
  public badCredentials = false;
  public technicalFailure = false;
  public user: User;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['member/dashboard']);
    };
    this.loginForm = this.fb.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  closeModal() {
    this.modalRef.hide();
    console.log('incident login ko => home')
    this.router.navigate(['home']);
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
      console.log('>login verif auth')
      this.authenticationService.login(this.user);
    } catch (error) {
      if (error.status === 401) {
        this.badCredentials = true;
      } else {
        this.technicalFailure = true;
      }
      console.log('bad cred', error)
    }
  }
}
