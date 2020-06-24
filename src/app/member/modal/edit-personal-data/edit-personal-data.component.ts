import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Member, Photo, RegisterData } from '@app/data/model/member';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { NotificationModalComponent } from '@app/shared/modal/notification-modal/notification-modal.component';
import { ErrorModalComponent } from '@app/shared/modal/error-modal/error-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FORMAT_RULES, TOOL_TIPS } from '@app/shared/constant/profile-form';
import { MemberDataService } from '@app/data/service/member-data.service';
import { UtilService } from '@app/shared/service/util.service';
import { EDIT_PROFILE } from '@app/shared/constant/notification-modal';

interface IPersonalData {
  id: string,
  firstName?: string,
  lastName?: string,
  email?: string;
  sex?: string;
  birthDate?: Date,
  presentation?: string,
  photo?: Photo,
  modificationAuthor: string
}

@Component({
  selector: 'app-edit-personal-data',
  templateUrl: './edit-personal-data.component.html',
  styleUrls: ['./edit-personal-data.component.css']
})
export class EditPersonalDataComponent implements OnInit {
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
      text: EDIT_PROFILE.personal_data_text
    }
  };

  public errorModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
  };

  public member: Member;
  public personalDataForm = [];
  public currentStepNb = 0;
  public progressValue = 0;
  public loading = false;
  public stepOneForm: FormGroup;
  public stepTwoForm: FormGroup;
  public titleCaseFirstName: string;
  public titleCaseLastName: string;
  public shortBirthDate: string;
  public defaultBirthDate: string;
  public minBirthDate: string;
  public maxBirthDate: string;

  public submitted = false;
  public updateStatus = true;

  public photo: Photo;
  public registerData = new RegisterData();
  public fileStatus = {
    invalid: false,
    invalidSizeMsg: `La taille du fichier est limitée à ${FORMAT_RULES.fileLimit / 1000}ko.`,
    invalidExtensionMsg: `L'extension du fichier n'est pas autorisée.`
  };
  public acceptFileExtensions = FORMAT_RULES.fileExtensions.join(',');
  public invalidFileMessage: string;

  public emailBlurred: boolean;

  public nameTooltip = TOOL_TIPS.name;
  public passwordTooltip = TOOL_TIPS.password;
  public pseudoTooltip = TOOL_TIPS.pseudo;

  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    public authenticationService: AuthenticationService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.minBirthDate = this.utilService.subtractYears(new Date(), 100);
    this.maxBirthDate = this.utilService.subtractYears(new Date(), 1);
    this.defaultBirthDate = this.utilService.subtractYears(new Date(), 35);
    this.shortBirthDate = this.updateMember.birthDate.toString().substring(0,10)

    this.titleCaseFirstName = this.utilService.toTitleCase(this.updateMember.firstName);
    this.titleCaseLastName = this.utilService.toTitleCase(this.updateMember.lastName);
    // formGroup de l'étape 1 du formulaire
    this.stepOneForm = this.fb.group({
      firstName: [
        this.titleCaseFirstName,
        [Validators.required,
        Validators.pattern(FORMAT_RULES.namePattern),
        Validators.maxLength(FORMAT_RULES.nameMax)]
      ],
      lastName: [
        this.titleCaseLastName,
        [Validators.required,
        Validators.pattern(FORMAT_RULES.namePattern),
        Validators.maxLength(FORMAT_RULES.nameMax)]
      ],
      email: [
        this.updateMember.email,
        [Validators.required,
        Validators.pattern(FORMAT_RULES.emailPattern),
        Validators.maxLength(FORMAT_RULES.emailMax)]
      ],
    });
    this.personalDataForm.push(this.stepOneForm);

    // formGroup de l'étape 2 du formulaire
    this.stepTwoForm = this.fb.group({
      sex: [this.updateMember.sex],
      birthDate: [this.shortBirthDate],
      presentation: [
        this.updateMember.presentation,
        Validators.maxLength(140)
      ],
      file: [null]
    });
    this.personalDataForm.push(this.stepTwoForm);
  }

  get currentStepValid() {
    return this.personalDataForm[this.currentStepNb].status === "VALID" ? true : false;
  }

  goToStep(step: string): void {
    if (step === 'prev') {
      this.currentStepNb = this.currentStepNb - 1;
      this.progressValue--;
    } else {
      this.currentStepNb = this.currentStepNb + 1;
      this.progressValue++;
    }
  }

  get stepOne() {
    return this.personalDataForm[0].controls;
  }
  get stepTwo() {
    return this.personalDataForm[1].controls;
  }

  reinitForm() {
    if (this.currentStepNb === 0) {
      this.stepOneForm.reset();
      this.stepOne.firstName.setValue(this.titleCaseFirstName);
      this.stepOne.lastName.setValue(this.titleCaseLastName);
      this.stepOne.email.setValue(this.updateMember.email);
    } else {
      this.stepTwoForm.reset();
      this.stepTwo.sex.setValue(this.updateMember.sex);
      this.stepTwo.birthDate.setValue(this.shortBirthDate);
      this.stepTwo.presentation.setValue(this.updateMember.presentation);
      this.photo = null;
    }

  }

  get noModification() {
    if (this.stepOneForm.dirty || this.stepTwoForm.dirty || this.photo) {
      return false;
    } else {
      return true;
    }
  }

  // ces fonctions bloquent les messages d'erreur pendant la saisie de l'email
  emailOnFocus() {
    this.emailBlurred = false;
  }
  emailOnBlur() {
    this.emailBlurred = true;
  }

  onFileSelect(files) {
    this.fileStatus.invalid = false;
    const reader = new FileReader();

    if (files && files.length) {
      const fileExtension = files[0].name.split('.').pop().toLowerCase();
      if (!this.acceptFileExtensions.includes(fileExtension)) {
        this.fileStatus.invalid = true;
        this.invalidFileMessage = this.fileStatus.invalidExtensionMsg;
        return;
      }

      if (files[0].size > FORMAT_RULES.fileLimit) {
        this.fileStatus.invalid = true;
        this.invalidFileMessage = this.fileStatus.invalidSizeMsg;
        return;
      }

      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.stepTwoForm.patchValue({
          file: reader.result
        });
      };
      this.photo = new Photo(files[0].name, files[0].type);
    }
  }

  //bloque la saisie de caractères interdits (inopérant sur mobile)
  checkNameInput(e) {
    if (FORMAT_RULES.nameAllowedChars.test(e.key) === false) {
      e.preventDefault();
    }
  }

  compareFields(updateMemberField, formField) {
    if (updateMemberField !== formField) {
      this.updateMember[updateMemberField] = formField
    }
  }

  setPersonalData() {
    return new Promise((resolve, reject) => {
      const personalData: IPersonalData = {
        id: this.updateMember._id,
        modificationAuthor: this.updateMember._id
      }
      const firstName = this.stepOneForm.value.firstName.toLowerCase();
      const lastName = this.stepOneForm.value.lastName.toLowerCase();
      const email = this.stepOneForm.value.email.toLowerCase();
      const sex = this.stepTwoForm.value.sex;
      const date = this.stepTwoForm.value.birthDate;
      const presentation = this.stepTwoForm.value.presentation;
      if (this.updateMember.firstName !== firstName) {
        personalData.firstName = firstName;
        this.updateMember.firstName = firstName;
      }
      if (this.updateMember.lastName !== lastName) {
        personalData.lastName = lastName;
        this.updateMember.lastName = lastName;
      }
      if (this.updateMember.email !== email) {
        personalData.email = email;
        this.updateMember.email = email;
      }
      if (this.updateMember.sex !== sex) {
        personalData.sex = sex;
        this.updateMember.sex = sex;
      }

      if (this.updateMember.birthDate.toString().substring(0, 10) !== date.substring(0, 10)) {
        personalData.birthDate = date
        this.updateMember.birthDate = date;
      }
      if (this.updateMember.presentation !== presentation) {
        personalData.presentation = presentation;
        this.updateMember.presentation = presentation;
      }
      if (this.photo) {
        this.photo.content = this.stepTwoForm.value.file;
        personalData.photo = this.photo;
      }
      resolve(personalData);
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.noModification) {
      return;
    }
    this.loading = true;
    if (this.currentStepNb < 1) {
      this.goToStep('next')
    }

    // // TODO refacto
    this.setPersonalData()
      .then(updateData => {
        this.memberDataService.update(updateData).subscribe(
          res => {
            this.updateStatus = res.save;
            if (this.updateStatus) {
              this.updateMember.photoUrl = res.photoUrl;
              this.updateCurrentMember();
              this.openNotificationModal();
            } else {
              this.loading = false;
              this.openErrorModal();
            }
          },
          error => {
            this.loading = false;
            console.error(error);
            this.updateStatus = false;
            this.openErrorModal();
          });
      });
  }

  //mise à jour des données du membre stocké en localStorage
  updateCurrentMember() {

    this.authenticationService.setUserProfile(this.updateMember);
  }

  closeModal() {
    this.modalRef.hide();
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
