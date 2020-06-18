import { LoginData } from './../../data/model/user';
import { AuthenticationService } from './../../core/service/authentication.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

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
  public loginData: LoginData;
  public loginStatus: any
  public submitted = false;
  public loading = false;
  public returnUrl: string;
  public badCredentials = false;
  public passwordExpired = false;
  public technicalFailure = false;
  public message: string;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) {
    if (this.authenticationService.isLoggedIn) {
      console.log('>login onInit : isLoggedIn => profile')
      this.router.navigate(['member/profile']);
    };
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'member/profile';
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
    this.loginData = this.loginForm.value;
    this.loginData.pseudo = this.loginForm.value.pseudo.toLowerCase();
    // TODO gestion retour KO
    this.loading = true;
    this.authenticationService.login(this.loginData)
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log('error login', error)

          if (error.notFound || error.authKO) {
            this.badCredentials = true;
          }
          if (error.exp) {
            this.passwordExpired = true;
          }
          this.loading = false;
        });
  }
}
