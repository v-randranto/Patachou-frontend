import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { MustMatch, PasswordStrength } from '@app/connection/custom-validator/custom-validator.validator';

@Component({
  selector: 'app-edit-personal-data',
  templateUrl: './edit-personal-data.component.html',
  styleUrls: ['./edit-personal-data.component.css']
})
export class EditPersonalDataComponent implements OnInit {
  //données passées par le composant Profil
  public title: string;
  public currentMember: Member;

  public nestedModalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      bgColor: '#a5d152',
      title: 'A y est, demande prise en compte!',
      text: 'Vos données personnelles sont mise à jour.'
    }
  };
  public errorModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
  };

  public member: Member;
  public registerForm = [];
  public currentStepNb = 0;
  public progressValue = 0;
  public stepOneForm: FormGroup;
  public stepTwoForm: FormGroup;
  public stepThreeForm: FormGroup;
  public submitted = false;
  public pseudoUnavailable = false;
  public registerStatus = {
    pseudoUnavailable: false,
    save: true,
    email: true
  }

  public photo: Photo;
  public registerData = new RegisterData();
  public fileStatus = {
    invalid: false,
    invalidSizeMsg: `La taille du fichier est limitée à ${FORMAT_RULES.fileLimit / 1000}ko.`,
    invalidExtensionMsg: `L'extension du fichier n'est pas autorisée.`
  };
  public acceptFileExtensions = FORMAT_RULES.fileExtensions.join(',');
  public invalidFileMessage: string;

  public maxBirthDate = '2002-12-31';
  public birthDateValue = '1979-01-01';

  public emailBlurred: boolean;

  public nameTooltip = TOOL_TIPS.name;
  public passwordTooltip = TOOL_TIPS.password;
  public pseudoTooltip = TOOL_TIPS.pseudo;

  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private router: Router,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
     // formGroup de l'étape 1 du formulaire
     this.stepOneForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.pattern(FORMAT_RULES.pseudoPattern), Validators.maxLength(FORMAT_RULES.pseudoMax)]],
      password: ['', [Validators.required, Validators.maxLength(FORMAT_RULES.passwordMax)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: [
          MustMatch("password", "confirmPassword"),
          PasswordStrength("password")
        ]
      },
    );
    this.registerForm.push(this.stepOneForm);

    // formGroup de l'étape 2 du formulaire
    this.stepTwoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(FORMAT_RULES.namePattern), Validators.maxLength(FORMAT_RULES.nameMax)]],
      lastName: ['', [Validators.required, Validators.pattern(FORMAT_RULES.namePattern), Validators.maxLength(FORMAT_RULES.nameMax)]],
      email: ['', [Validators.required, Validators.pattern(FORMAT_RULES.emailPattern), Validators.maxLength(FORMAT_RULES.emailMax)]],
    });
    this.registerForm.push(this.stepTwoForm);

    // formGroup de l'étape 3 du formulaire
    this.stepThreeForm = this.fb.group({
      sex: [''],
      birthDate: [new Date('1980-01-01')],
      presentation: ['', Validators.maxLength(140)],
      file: [null]
    });
    this.registerForm.push(this.stepThreeForm);

    this.stepThree.birthDate.setValue('1980-01-01');
    console.log("step1Form", this.stepOneForm.status)
    console.log("step2Form", this.stepTwoForm.status)
    console.log("step3Form", this.stepThreeForm.status)
  }


  get currentStepValid() {
    return this.registerForm[this.currentStepNb].status === "VALID" ? true : false;
  }

  goToStep(step: string): void {
    console.log('>goToStep step', this.currentStepNb)
    console.log('form status', this.registerForm[this.currentStepNb].status)
    if (step === 'prev') {
      this.currentStepNb = this.currentStepNb - 1;
      this.progressValue--;
    } else {
      this.currentStepNb = this.currentStepNb + 1;
      this.progressValue++;
    }

    // this.currentStepNb =
    //   step === 'prev' ? this.currentStepNb - 1 : this.currentStepNb + 1;
  }

  get stepOne() {
    return this.registerForm[0].controls;
  }
  get stepTwo() {
    return this.registerForm[1].controls;
  }
  get stepThree() {
    return this.registerForm[2].controls;
  }

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
        this.stepThreeForm.patchValue({
          file: reader.result
        });
      };
      this.photo = new Photo(files[0].name, files[0].type);
    }
  }

  // Les 2 fonctions ci-dessous bloquent la saisie de caractères interdits (inopérant sur mobile)
  checkPseudoInput(e) {
    // if (this.registerStatus.pseudoUnavailable) {
    //   this.registerStatus.pseudoUnavailable = false;
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


  onSubmit() {
    this.submitted = true;
    if (this.currentStepNb < 2) {
      this.goToStep('next')
    }

    // // TODO refacto
    this.member.pseudo = this.stepOneForm.value.pseudo.toLowerCase();
    this.member.password = this.stepOneForm.value.password;
    this.member.firstName = this.stepTwoForm.value.firstName.toLowerCase();
    this.member.lastName = this.stepTwoForm.value.lastName.toLowerCase();
    this.member.email = this.stepTwoForm.value.email.toLowerCase();
    this.member.sex = this.stepThreeForm.value.sex;
    this.member.birthDate = this.stepThreeForm.value.birthDate;
    this.member.presentation = this.stepThreeForm.value.presentation || 'Pas de présentation';
    this.registerData.member = this.member;
    if (this.photo) {
      this.photo.content = this.stepThreeForm.value.file;
      this.registerData.photo = this.photo;
    }
    console.log('member', this.registerData.member);
    this.memberDataService.register(this.registerData).subscribe(
      res => {
        console.log('res', res)
        this.registerStatus = res;
        console.log('register status', this.registerStatus);
        if (this.registerStatus.pseudoUnavailable) {
          this.currentStepNb = 0;
          // this.pseudoRef.nativeElement.focus();
        } else {
          if (this.registerStatus.save) {
            this.openNotificationModal();
          } else {
            // TODO refacto
            this.openErrorModal();
          }
        }
      },
      error => {
        console.error(error);
        this.registerStatus.save = false;
        this.openErrorModal();
      });
  }

  closeModal() {
    this.modalRef.hide();
  }

  openErrorModal() {
    this.closeModal();
    this.nestedModalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

  valueInitialState(dataStatus) {
    let text: string;
    switch (dataStatus) {
      // case this.status_confirmed:
      //   text = `Vous êtes pote avec ${this.toTitleCase(this.selectedMember.pseudo)}.`;
      //   break;
      // case this.status_rejected:
      //   text = `La demande de ${this.toTitleCase(this.selectedMember.pseudo)} est rejetée.`;
      //   break;
      // case this.status_terminated:
      //   text = `Vous n'êtes plus pote avec ${this.toTitleCase(this.selectedMember.pseudo)}.`;
      //   break;
    }
    const initialState = {
      bgColor: '#a5d152',
      title: 'A y est, demande prise en compte!',
      text: text
    }
    this.notificationModalConfig.initialState = initialState;;
  }

  openNotificationModal() {
    this.closeModal();
    this.nestedModalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }
}
