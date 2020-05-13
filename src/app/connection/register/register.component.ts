import { MemberDataService } from '@app/data/service/member-data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { faUpload, faMars, faVenus, faVenusMars, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { Member } from '@app/data/model/member';
import { Router } from '@angular/router';

const LIMIT_SIZE_FILE = 250 * 1000;
const allowedFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
const emailPattern = '';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public submitted = false;
  public member = new Member;
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
      pseudo: ['', [Validators.required, Validators.pattern(''), Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern), Validators.maxLength(50)]],
      sex: [''],
      birthDate: [null],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(128)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(128)]],
      presentation: ['', Validators.maxLength(1000)],
      pix: [null],
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onFileSelect(files) {
    // this.fileStatus.invalid = false;
    const reader = new FileReader();

    // if (files && files.length) {
    //   const fileExtension = files[0].name.split('.').pop();
    //   if (!this.acceptFileExtensions.includes(fileExtension)) {
    //     this.fileStatus.invalid = true;
    //     this.invalidFileMessage = this.attachmentStatus.invalidExtensionMsg;
    //     return;
    //   }

    //   if (files[0].size > LIMIT_SIZE_FILE) {
    //     this.fileStatus.invalid = true;
    //     this.invalidFileMessage = this.fileStatus.invalidSizeMsg;
    //     return;
    //   }

    //   this.attachment = new Attachment(files[0].name, files[0].type);
    //   const file = files[0];
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.registerForm.patchValue({
    //       file: reader.result
    //     });
    //   };
    // }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.registerForm.value);
    this.member.pseudo = this.registerForm.value.pseudo;
    this.member.firstName = this.registerForm.value.firstName;
    this.member.lastName = this.registerForm.value.lastName;
    this.member.sex = this.registerForm.value.sex;
    this.member.birthDate = this.registerForm.value.birthDate;
    this.member.email = this.registerForm.value.email;
    this.member.password = this.registerForm.value.password;
    this.member.presentation = this.registerForm.value.presentation;
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
