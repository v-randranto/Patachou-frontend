import { UtilService } from './../../../shared/service/util.service';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Member } from '@app/data/model/member';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { NotificationModalComponent } from '@app/shared/modal/notification-modal/notification-modal.component';
import { ErrorModalComponent } from '@app/shared/modal/error-modal/error-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FORMAT_RULES, TOOL_TIPS } from '@app/shared/constant/profile-form';
import { EDIT_PROFILE } from '@app/shared/constant/notification-modal';
import { MemberDataService } from '@app/data/service/member-data.service';
import { MustMatch, PasswordStrength } from '@app/connection/custom-validator/custom-validator.validator';

interface ICredentialsData {
  id: string;
  pseudo?: string;
  password?: string;
  modificationAuthor: string;
}

@Component({
  selector: 'app-edit-credentials',
  templateUrl: './edit-credentials.component.html',
  styleUrls: ['./edit-credentials.component.css']
})
export class EditCredentialsComponent implements OnInit {
  @ViewChild('pseudo') pseudoRef: ElementRef;
  //données passées par le composant Profil
  public title: string;
  public updateMember: Member;

  public nestedModalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      color: EDIT_PROFILE.color,
      title: EDIT_PROFILE.title,
      text: EDIT_PROFILE.credentials_text
    }
  };
  public errorModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
  };

  public credentialsForm: FormGroup;
  public submitted = false;
  public loading = false;
  public noModification = false;
  public updateStatus = {
    pseudoUnavailable: false,
    save: true
  }

  public passwordTooltip = TOOL_TIPS.password;
  public pseudoTooltip = TOOL_TIPS.pseudo;

  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private authenticationService: AuthenticationService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.credentialsForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.pattern(FORMAT_RULES.pseudoPattern), Validators.maxLength(FORMAT_RULES.pseudoMax)]],
      password: ['', [Validators.maxLength(FORMAT_RULES.passwordMax)]],
      confirmPassword: ['']
    },
      {
        validator: [
          MustMatch("password", "confirmPassword"),
          PasswordStrength("password")
        ]
      },
    );
    this.formControls.pseudo.setValue(this.utilService.toTitleCase(this.updateMember.pseudo))
  }

  get formControls() {
    return this.credentialsForm.controls;
  }

  // Les 2 fonctions ci-dessous bloquent la saisie de caractères interdits (inopérant sur mobile)
  checkPseudoInput(e) {
    // if (this.credentialsStatus.pseudoUnavailable) {
    //   this.credentialsStatus.pseudoUnavailable = false;
    // }
    if (FORMAT_RULES.pseudoAllowedChars.test(e.key) === false) {
      e.preventDefault();
    }
  }

  checkNameInput(e) {
    if (FORMAT_RULES.nameAllowedChars.test(e.key) === false) {
      e.preventDefault();
    }
  }

  reinitForm() {
    this.credentialsForm.reset();
    this.submitted = false;
    this.noModification = false;
    this.updateStatus.save = true;
    this.formControls.pseudo.setValue(this.utilService.toTitleCase(this.updateMember.pseudo));
  }

  setCredentialsData() {
    return new Promise((resolve, reject) => {
      let credentialsData: ICredentialsData = {
        id: this.updateMember._id,
        modificationAuthor: this.updateMember._id
      };
      const pseudo = this.credentialsForm.value.pseudo.toLowerCase();
      if (this.updateMember.pseudo !== pseudo) {
        credentialsData.pseudo = pseudo;
        this.updateMember.pseudo = pseudo;
      }
      if (this.credentialsForm.value.password) {
        credentialsData.password = this.credentialsForm.value.password;
      }
      resolve(credentialsData);
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.credentialsForm.pristine){
      this.noModification = true;
      return;
    }

    this.loading = true;

    this.setCredentialsData()
      .then(updateData => {
        this.memberDataService.update(updateData).subscribe(
          res => {
            this.updateStatus = res;
            if (this.updateStatus.pseudoUnavailable) {
              this.loading = false;
            } else {
              if (this.updateStatus.save) {
                if (this.credentialsForm.value.pseudo) {
                  this.updateCurrentMember();
                }
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
            this.updateStatus.save = false;
            this.openErrorModal();
          });

      })
  }

  closeModal() {
    this.modalRef.hide();
  }

  //mise à jour des données du membre stocké en localStorage
  updateCurrentMember() {
    this.authenticationService.setUserProfile(this.updateMember);
  }

  openErrorModal() {
    this.closeModal();
    this.nestedModalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

  openNotificationModal() {
    this.closeModal();
    this.nestedModalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }
}
