import { FORMAT_RULES } from '@shared/constant/profile-form';
import { ErrorModalComponent } from '@shared/modal/error-modal/error-modal.component';
import { NotificationModalComponent } from '@shared/modal/notification-modal/notification-modal.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch, PasswordStrength } from '@app/connection/custom-validator/custom-validator.validator';
import { MemberDataService } from '@app/data/service/member-data.service';
import { Member, Photo, RegisterData } from '@app/data/model/member';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {
  @ViewChild('pseudo') pseudoRef: ElementRef;
  public modalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      bgColor: '#a5d152',
      title: 'A y est, vous êtes des nôtres!',
      text: `Un email vous a été envoyé pour confirmer votre inscription. Si vous ne le recevez pas, vérifiez votre adresse dans le profil de votre compte.`,
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

  public member = new Member();
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
  public passwordTooltip = 'Saisir 8 caractères minimum avec 3 des caractéristiques suivantes: 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial';
  public pseudoTooltip = 'format alphanumérique avec apostrophe, tiret et espace permis';
  public nameTooltip = 'format alphabétique avec apostrophe, tiret et espace permis';

  constructor(
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn) {
      console.log('>login onInit : isLoggedIn => profile');
      this.router.navigate(['member/profile']);
    };

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

  resetPseudo() {
    this.pseudoRef.nativeElement.value = '';
  }

  // checkPseudoAvailability(pseudo) {
  //   console.log('>checkPseudo', pseudo)
  //   this.memberDataService.checkPseudo({ pseudo }).subscribe(
  //     res => {
  //       this.pseudoUnavailable = res;
  //       alert(`pseudo unavailable? ${this.pseudoUnavailable}`)
  //       this.pseudoUnavailable;
  //     },
  //     error => {
  //       console.error(error);
  //     });
  // }

  openErrorModal() {
    this.modalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

  openNotificationModal() {
    this.modalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
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

}
