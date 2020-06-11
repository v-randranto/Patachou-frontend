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

const LIMIT_SIZE_FILE = 500 * 1000;
const allowedFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

const namePatternBase = `a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð`;
const namesPattern = `^[${namePatternBase}]+(([' -][${namePatternBase}])?[${namePatternBase}]*)*$`;
const pseudoPattern = `^[${namePatternBase}0-9]+(([' -][${namePatternBase}0-9])?[${namePatternBase}0-9]*)*$`;
const emailPattern = `^([a-zA-Z0-9.]+)@([a-zA-Z0-9-.]+).([a-zA-Z]{2,5})$`;
const maxPseudo = 30, maxNames = 30, maxEmail = 50, maxPassword = 30;

// const pseudoAllowedChar = /[a-zA-Z0-9]/;
const pseudoAllowedChar = /[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž -]/i;
const nameAllowedChar = /[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž -]/i;

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
    initialState: {
      title: 'A y est, vous êtes des nôtres!',
      text: `Un email vous a été envoyé pour confirmer votre inscription. Si vous ne le recevez pas, vérifiez votre adresse dans le profil de votre compte.`,
      redirection: `/connection/login`
    }
  };
  public errorModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    redirection: `/home`
  };
  public registerForm: FormGroup;
  public submitted = false;
  public registerStatus = {
    pseudoUnavailable: false,
    save: true,
    email: true
  }
  public defaultBirthDate = '1980-01-01';
  public member = new Member();
  public photo: Photo;
  public registerData = new RegisterData();
  public fileStatus = {
    invalid: false,
    invalidSizeMsg: `La taille du fichier est limitée à ${LIMIT_SIZE_FILE / 1000}ko.`,
    invalidExtensionMsg: `L'extension du fichier n'est pas autorisée.`
  };
  public acceptFileExtensions = allowedFileExtensions.join(',');
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
      this.router.navigate(['member/dashboard']);
    };
    this.registerForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.pattern(pseudoPattern), Validators.maxLength(maxPseudo)]],
      firstName: ['', [Validators.required, Validators.pattern(namesPattern), Validators.maxLength(maxNames)]],
      lastName: ['', [Validators.required, Validators.pattern(namesPattern), Validators.maxLength(maxNames)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern), Validators.maxLength(maxEmail)]],
      sex: [''],
      birthDate: [null],
      password: ['', [Validators.required, Validators.maxLength(maxPassword)]],
      confirmPassword: ['', Validators.required],
      presentation: ['', Validators.maxLength(140)],
      file: [null]
    },
      {
        validator: [
          MustMatch("password", "confirmPassword"),
          PasswordStrength("password")
        ]
      },
    );

    this.formControls.birthDate.setValue('1980-01-01');
  }

  get formControls() {
    return this.registerForm.controls;
  }

  getDefaultDate() {
    return '1980-01-01';
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

      if (files[0].size > LIMIT_SIZE_FILE) {
        this.fileStatus.invalid = true;
        this.invalidFileMessage = this.fileStatus.invalidSizeMsg;
        return;
      }

      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.registerForm.patchValue({
          file: reader.result
        });
      };
      this.photo = new Photo(files[0].name, files[0].type);
    }
  }

  // Les 2 fonctions ci-dessous bloquent la saisie de caractères interdits (inopérant sur mobile)
  checkPseudoInput(e) {
    if (this.registerStatus.pseudoUnavailable) {
      this.registerStatus.pseudoUnavailable = false;
    }
    if (pseudoAllowedChar.test(e.key) === false) {
      e.preventDefault();
    }
  }

  checkNameInput(e) {
    if (nameAllowedChar.test(e.key) === false) {
      e.preventDefault();
    }
  }

  resetPseudo() {
    this.pseudoRef.nativeElement.value = '';
  }

  openErrorModal() {
    this.modalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

  openNotificationModal() {
    this.modalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }

    onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    // TODO refacto
    this.member.pseudo = this.registerForm.value.pseudo.toLowerCase();
    this.member.firstName = this.registerForm.value.firstName.toLowerCase();
    this.member.lastName = this.registerForm.value.lastName.toLowerCase();
    this.member.sex = this.registerForm.value.sex;
    this.member.birthDate = this.registerForm.value.birthDate;
    this.member.email = this.registerForm.value.email.toLowerCase();
    this.member.password = this.registerForm.value.password;
    this.member.presentation = this.registerForm.value.presentation || 'Pas de présentation';
    this.registerData.member = this.member;
    if (this.photo) {
      this.photo.content = this.registerForm.value.file;
      this.registerData.photo = this.photo;
    }
    console.log(`title case ${this.member.pseudo} ${this.member.firstName} ${this.member.lastName}`)
    this.memberDataService.register(this.registerData).subscribe(
      res => {
        this.registerStatus = res;
        if (this.registerStatus.pseudoUnavailable) {
          this.pseudoRef.nativeElement.focus();
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
