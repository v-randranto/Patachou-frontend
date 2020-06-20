import { Component, OnInit } from '@angular/core';
import { Member, Photo } from '@app/data/model/member';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EditCredentialsComponent } from '../modal/edit-credentials/edit-credentials.component';
import { EditPersonalDataComponent } from '../modal/edit-personal-data/edit-personal-data.component';


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
  public member: Member;
  public photo: Photo;

  public updCredentials ='credentials';
  public updPersonalData ='personal';
  public reloadMemmber = false;

  public modalRef: BsModalRef;
  public modalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      title: '',
      updateMember: null
    }
  };

  constructor(
    private authenticationService: AuthenticationService,
    private modalService: BsModalService
  ) {
    this.member = this.authenticationService.userProfile;
  }
  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
  }

  openModal(target: string) {
    this.modalConfig.initialState.updateMember = this.member;
    if (target === this.updCredentials) {
      this.modalConfig.initialState.title = 'Mes identifiants'
      this.modalRef = this.modalService.show(EditCredentialsComponent, this.modalConfig);
    } else {
      this.modalConfig.initialState.title = 'Mes données personnelles'
      this.modalRef = this.modalService.show(EditPersonalDataComponent, this.modalConfig);
    }
  }

  update(target: string){
    this.openModal(target);
  }
}
