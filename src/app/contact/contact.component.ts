import { EmailService } from '@data/service/email.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CONTACT_EMAIL } from '@shared/constant/notification-modal';
import { FORMAT_RULES } from '@shared/constant/profile-form';
import { ErrorModalComponent } from '@shared/modal/error-modal/error-modal.component';
import { NotificationModalComponent } from '@shared/modal/notification-modal/notification-modal.component';
import { UtilService } from '@shared/service/util.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public contactForm: FormGroup;
  public contactStatus: any
  public submitted = false;
  public emailBlurred: boolean;
  public loading = false;

  public modalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      color: CONTACT_EMAIL.color,
      title: CONTACT_EMAIL.title,
      text: CONTACT_EMAIL.text,
      redirection: `/home`
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

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private modalService: BsModalService,
    private utilService: UtilService
    ) { }

  ngOnInit(): void {

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(FORMAT_RULES.namePattern), Validators.maxLength(FORMAT_RULES.nameMax)]],
      email: ['', [Validators.required, Validators.pattern(FORMAT_RULES.emailPattern), Validators.maxLength(FORMAT_RULES.emailMax)]],
      message: ['', [Validators.required, Validators.maxLength(200)]]
    });

  }

  get formControls() {
    return this.contactForm.controls;
  }

  reinitForm() {
    this.contactForm.reset();
    this.submitted = false;
    this.contactStatus = true;
  }

  emailOnFocus() {
    this.emailBlurred = false;
  }
  emailOnBlur() {
    this.emailBlurred = true;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.contactForm.invalid) {
      return;
    }

    const data = {
      subject: `Message de ${this.utilService.toTitleCase(this.contactForm.value.name)}`,
      email: this.contactForm.value.email,
      text: this.contactForm.value.message
    }

    this.emailService.send(data).subscribe(
      res => {
        this.contactStatus = res;
          if (this.contactStatus) {
            this.openNotificationModal();
          } else {
            this.openErrorModal();
          }
          this.loading = false;
          this.reinitForm();
      },
      error => {
        console.error(error);
        this.loading = false;
        this.contactStatus = false;
        this.openErrorModal();
      });
  }

  openErrorModal() {
    this.modalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

  openNotificationModal() {
    this.modalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }
}
