import { MemberDataService } from '@app/data/service/member-data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '@app/connection/custom-validator/custom-validator.validator';

import { faUpload, faMars, faVenus, faVenusMars, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { Member, Photo } from '@app/data/model/member';
import { Router } from '@angular/router';

const LIMIT_SIZE_FILE = 100 * 1000;
const allowedFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

const namePatternBase = `a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð`;
const namesPattern = `^[${namePatternBase}]+(([' -][${namePatternBase}])?[${namePatternBase}]*)*$`;
const pseudoPattern = `^[${namePatternBase}0-9]+(([' -][${namePatternBase}0-9])?[${namePatternBase}0-9]*)*$`;
const emailPattern = `^([a-zA-Z0-9.]+)@([a-zA-Z0-9-.]+).([a-zA-Z]{2,5})$`;
const maxPseudo = 20, maxNames = 30, maxEmail = 50, minPassword = 4, maxPassword = 50;

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted = false;
  public defaultBirthDate = '1980-01-01';
  public member = new Member();
  public photo: Photo;
  public fileStatus = {
    invalid: false,
    invalidSizeMsg: `La taille du fichier est limitée à ${LIMIT_SIZE_FILE / 1000}ko.`,
    invalidExtensionMsg: `L'extension du fichier n'est pas autorisée.`
  };
  public acceptFileExtensions = allowedFileExtensions.join(',');
  public invalidFileMessage: string;
  public uploadIcon = faUpload;
  public femaleIcon = faVenus;
  public maleIcon = faMars;
  public otherIcon = faVenusMars;
  public birthDateIcon = faBirthdayCake;

  constructor(
    private fb: FormBuilder,
    private memberDataService: MemberDataService,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.pattern(pseudoPattern), Validators.maxLength(maxPseudo)]],
      firstName: ['', [Validators.required, Validators.pattern(namesPattern), Validators.maxLength(maxNames)]],
      lastName: ['', [Validators.required, Validators.pattern(namesPattern), Validators.maxLength(maxNames)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern), Validators.maxLength(maxEmail)]],
      sex: [''],
      birthDate: [null],
      password: ['', [Validators.required, Validators.minLength(minPassword), Validators.maxLength(maxPassword)]],
      confirmPassword: ['', Validators.required],
      presentation: ['', Validators.maxLength(1000)],
      file: [null]
    },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    );
  }

  get formControls() {
    return this.registerForm.controls;
  }

  getDefaultDate() {
    return '1980-01-01';
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

      this.photo = new Photo(files[0].name, files[0].type);

      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.registerForm.patchValue({
          file: file
        });
      };
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    // TODO refacto

    this.member.pseudo = this.registerForm.value.pseudo;
    this.member.firstName = this.registerForm.value.firstName;
    this.member.lastName = this.registerForm.value.lastName;
    this.member.sex = this.registerForm.value.sex;
    this.member.birthDate = this.registerForm.value.birthDate;
    this.member.email = this.registerForm.value.email;
    this.member.password = this.registerForm.value.password;
    this.member.presentation = this.registerForm.value.presentation;

    if (this.photo) {
      this.member.photo = this.photo;
      this.member.photo.content = this.registerForm.value.file;

    }
    this.memberDataService.addMember(this.member).subscribe(
      res => {
        this.router.navigate(['/connection/login'])
      },
      error => {
        console.error(error);
      });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
