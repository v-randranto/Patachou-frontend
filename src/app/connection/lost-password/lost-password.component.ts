import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LOST_PASSWORD } from '@app/shared/constant/notification-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberDataService } from '@app/data/service/member-data.service';
import { Router } from '@angular/router';
import { ErrorModalComponent } from '@app/shared/modal/error-modal/error-modal.component';
import { NotificationModalComponent } from '@app/shared/modal/notification-modal/notification-modal.component';
import { FORMAT_RULES } from '@app/shared/constant/profile-form';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})

export class LostPasswordComponent implements OnInit {
  @ViewChild('email') emailRef: ElementRef;
  public modalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      color: LOST_PASSWORD.color,
      title: LOST_PASSWORD.title,
      text: LOST_PASSWORD.text,
      redirection: `/connection/login`
    }
  };
  public errorModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      redirection: `/home`
    }
  };
  public emailForm: FormGroup;
  public emailSave: string;
  public submitted = false;
  public loading = false;
  public passwordStatus = {
    emailNotFound: false,
    save: true,
    email: true,
  }
  public technicalFailure = false;

  constructor(
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(FORMAT_RULES.emailPattern), Validators.maxLength(FORMAT_RULES.emailMax)]]
    });
  }

  get formControls() {
    return this.emailForm.controls;
  }

  reinit() {
    this.emailForm.reset();
    this.formControls.email.setValue(this.emailSave);
    this.passwordStatus.emailNotFound = false;
    this.passwordStatus.save = true;
    this.passwordStatus.email = true;
  }

  openErrorModal() {
    this.modalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

  openNotificationModal() {
    this.modalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }

  onSubmit() {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    }
    this.loading = true;
    this.emailSave = this.emailForm.value.email;
    this.memberDataService.lostPassword({email: this.emailSave.toLowerCase()}).subscribe(
      res => {
        this.passwordStatus = res;
        if (this.passwordStatus.emailNotFound) {
          this.loading = false;
          this.submitted = false;
        } else {
          if (this.passwordStatus.save) {
            this.openNotificationModal();
          } else {
            this.loading = false;
            this.openErrorModal();
          }
        }
      },
      error => {
        console.error(error);
        this.loading = false;
        this.passwordStatus.save = false;
        this.openErrorModal();
      });
  }
}


