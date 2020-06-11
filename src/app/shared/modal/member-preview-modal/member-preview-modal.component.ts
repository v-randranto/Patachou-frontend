import { RelationDataService } from '@app/data/service/relation-data.service';
import { AuthenticationService } from '@core/service/authentication.service';
import { Member } from '@app/data/model/member';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Relationship, ComplementaryData, RelationForm } from '@app/data/model/relationship';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';

@Component({
  selector: 'app-member-preview-modal',
  templateUrl: './member-preview-modal.component.html',
  styleUrls: ['./member-preview-modal.component.css']
})
export class MemberPreviewModalComponent {
  public currentMember: Member;
  public selectedMember: Member;
  // ajout d'un ami
  public relationForm: RelationForm;
  public relationStatus = {
    save: true,
    email: true
  }
  public actionBtn = `Je lui demande d'être pote avec moi`;

  public nestedModalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      title: 'A y est, demande enregistrée!',
      text: `Votre proie est avertie de votre demande.`
    }
  };
  public errorModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
  };
  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    public authenticationService: AuthenticationService,
    public relationDataService: RelationDataService
  ) { }

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
  // faire une demande d'ami sur le membre sélectionné
  relationRequest() {
    this.currentMember = this.authenticationService.userProfile;
    const relation = new Relationship(this.currentMember._id, this.selectedMember._id);
    const complementary = new ComplementaryData(this.currentMember.pseudo, this.selectedMember.pseudo, this.currentMember.email);
    this.relationForm = new RelationForm(relation, complementary);
    this.relationDataService.add(this.relationForm).
      subscribe(res => {
        this.relationStatus = res;
        if (this.relationStatus.save) {
          this.openNotificationModal();
        } else {
          this.openErrorModal();
        }
      }, error => {
        this.relationStatus.save = false;
        this.openErrorModal();
      });
  }
}
