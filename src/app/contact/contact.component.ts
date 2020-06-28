import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CONTACT_EMAIL } from '@shared/constant/notification-modal';
import { FORMAT_RULES } from '@app/shared/constant/profile-form';

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
      text: CONTACT_EMAIL.text
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
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService) { }

  ngOnInit(): void {

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(FORMAT_RULES.namePattern), Validators.maxLength(FORMAT_RULES.nameMax)]],
      email: ['', [Validators.required, Validators.pattern(FORMAT_RULES.emailPattern), Validators.maxLength(FORMAT_RULES.emailMax)]],
      message: ['', Validators.maxLength(200)]
    });
  }

  get formControls() {
    return this.contactForm.controls;
  }


  emailOnFocus() {
    this.emailBlurred = false;
  }
  emailOnBlur() {
    this.emailBlurred = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
  }

}
