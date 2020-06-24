import { UtilService } from '@app/shared/service/util.service';
import { FORMAT_RULES, TOOL_TIPS } from '@shared/constant/profile-form';
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
import { REGISTER_PROFILE } from '@app/shared/constant/notification-modal';


@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {
  @ViewChild('pseudo') pseudoRef: ElementRef;
  @ViewChild('firstName') firstNameRef: ElementRef;
  public modalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      color: REGISTER_PROFILE.color,
      title: REGISTER_PROFILE.title,
      text: REGISTER_PROFILE.text,
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
  public loading = false;
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

  public minBirthDate: string;
  public maxBirthDate: string;
  public defaultBirthDate: string;
  public emailBlurred: boolean;
  public nameTooltip = TOOL_TIPS.name;
  public passwordTooltip = TOOL_TIPS.password;
  public pseudoTooltip = TOOL_TIPS.pseudo;

  constructor(
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: BsModalService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['member/profile']);
    };

    this.minBirthDate = this.utilService.subtractYears(new Date(), 100);
    this.maxBirthDate = this.utilService.subtractYears(new Date(), 1);
    this.defaultBirthDate = this.utilService.subtractYears(new Date(), 35);

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
      birthDate: [this.defaultBirthDate],
      presentation: ['', Validators.maxLength(140)],
      file: [null]
    });
    this.registerForm.push(this.stepThreeForm);
  }

  get currentStepValid() {
    return this.registerForm[this.currentStepNb].status === "VALID" ? true : false;
  }

  goToStep(step: string): void {
    if (step === 'prev') {
      this.currentStepNb = this.currentStepNb - 1;
      this.progressValue--;
    } else {
      this.currentStepNb = this.currentStepNb + 1;
      this.progressValue++;
    }

    if (this.currentStepNb === 0) {
      this.pseudoRef.nativeElement.focus();
    } else if (this.currentStepNb === 1) {
      this.firstNameRef.nativeElement.focus();
    }

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

  reinitForm() {
    if (this.currentStepNb === 0) {
      this.stepOneForm.reset();
    } else if (this.currentStepNb === 1) {
      this.stepTwoForm.reset();
    } else {
      this.stepThreeForm.reset();
      this.stepThree.birthDate.setValue(this.defaultBirthDate);
      this.photo = null;
    }
  }

  // ces fonctions bloquent les messages d'erreur de saisie jusqu'à la fin de la saisie de l'email
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
    this.loading = true;
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
    this.memberDataService.register(this.registerData).subscribe(
      res => {
        this.registerStatus = res;
        if (this.registerStatus.pseudoUnavailable) {
          this.currentStepNb = 0;
          this.loading = false;
          this.pseudoRef.nativeElement.focus();
        } else {
          if (this.registerStatus.save) {
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
        this.registerStatus.save = false;
        this.openErrorModal();
      });
  }

}
