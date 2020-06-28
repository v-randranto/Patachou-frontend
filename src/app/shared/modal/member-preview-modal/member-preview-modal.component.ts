import { RelationDataService } from '@app/data/service/relation-data.service';
import { AuthenticationService } from '@core/service/authentication.service';
import { Member } from '@app/data/model/member';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Relationship, ComplementaryData, RelationForm } from '@app/data/model/relationship';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { NETWORK_REQUEST } from '@app/shared/constant/notification-modal';
import { SocketIoService } from '@app/core/service/socket-io.service';
import { UtilService } from '@app/shared/service/util.service';

@Component({
  selector: 'app-member-preview-modal',
  templateUrl: './member-preview-modal.component.html',
  styleUrls: ['./member-preview-modal.component.css']
})
export class MemberPreviewModalComponent implements OnInit {
  public currentMember: Member;
  public dateLabel: string;
  public relations: Relationship[];

  // propriétés transmises par le composant appelant
  public selectedRelation: Relationship;
  public relationType: string;
  public selectedMember: Member;

  // statuts possibles d'une relation
  public status_pending = 'PENDING';
  public status_confirmed = 'CONFIRMED';
  public status_rejected = 'REJECTED'
  public status_terminated = 'TERMINATED'
  // catégorisation des relations (relation Types)
  public relation_confirmed = 'CONFIRMED'; // si statut confirmé
  public relation_in_waiting = 'IN_WAITING'; // si statut en attente et le membre en cours est demandeur
  public relation_to_validate = 'TO_VALIDATE'; // si statut à valider et le membre en cours est receveur
  public relation_to_befriend = 'TO_BEFRIEND';


  // ajout d'un ami
  public relationForm: RelationForm;
  public requestStatus = {
    alreadyRelated: false,
    save: true,
    email: true
  }

  // statut d'une requête de mise à jour d'une relation
  public updateStatus = {
    badRequest: false,
    save: true,
  }

  public nestedModalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      color: NETWORK_REQUEST.color,
      title: NETWORK_REQUEST.title,
      text: ''
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
    public relationDataService: RelationDataService,
    private socketService: SocketIoService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.currentMember = this.authenticationService.userProfile;
    if (this.selectedRelation) {
      switch (this.relationType) {
        case this.relation_confirmed:
          this.dateLabel = 'Potes depuis le ';
          break;
        case this.relation_in_waiting:
          this.dateLabel = 'Envoyée le ';
          break;
        case this.relation_to_validate:
          this.dateLabel = 'Reçue le ';
          break;
      }
    }
  }

  get isConfirmed() {
    return this.relationType == this.relation_confirmed;
  }
  get inWaiting() {
    return this.relationType == this.relation_in_waiting;
  }
  get toValidate() {
    return this.relationType == this.relation_to_validate;
  }
  get toBefriend() {
    return this.relationType == this.relation_to_befriend;
  }

  closeModal() {
    this.modalRef.hide();
  }

  openErrorModal() {
    this.closeModal();
    this.nestedModalRef = this.modalService.show(ErrorModalComponent, this.errorModalConfig);
  }

// configuration de la modale de confirmation de la mise à jour de la relation
  valueInitialState(dataStatus: string) {
    let text: string;
    const pseudo = this.utilService.toTitleCase(this.selectedMember.pseudo)
    // alimentation du texte à afficher en fonction du statut finale de la relation
    switch (dataStatus) {
      case this.status_confirmed:
        text = `${NETWORK_REQUEST.confirm_text} ${pseudo}.`;
        break;
      case this.status_rejected:
        text = `${NETWORK_REQUEST.reject_text} ${pseudo}.`;
        break;
      case this.status_terminated:
        text = `${NETWORK_REQUEST.unfriend_text} ${pseudo}.`;
        break;
    }
    this.notificationModalConfig.initialState.text = text;
  }

  openNotificationModal() {
    this.closeModal();
    this.nestedModalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }

  // faire une demande d'ami sur le membre sélectionné
  relationRequest() {
    const relation = new Relationship(this.currentMember._id, this.selectedMember._id);
    const complementary = new ComplementaryData(this.currentMember.pseudo, this.selectedMember.pseudo, this.selectedMember.email);

    this.relationForm = new RelationForm(relation, complementary);

    this.relationDataService.add(this.relationForm).
      subscribe(res => {
        this.requestStatus = res;
        if (!this.requestStatus.save || this.requestStatus.alreadyRelated) {
          this.openErrorModal();
        } else {
          this.notificationModalConfig.initialState.text = `${NETWORK_REQUEST.request_text} ${this.utilService.toTitleCase(this.selectedMember.pseudo)}.`;
          this.openNotificationModal();
        }
      }, error => {
        this.requestStatus.save = false;
        this.openErrorModal();
      });
  }

  // exécuter la màj de la relation (confirmation, rejet ou suppression)
  relationUpdate(status: string) {
    const data = {
      id: this.selectedRelation._id,
      status: status,
      modificationAuthor: this.currentMember._id
    }

    try {
      this.socketService.updateRelation(data);
      this.valueInitialState(data.status);
      this.openNotificationModal();
    } catch (error) {
      this.updateStatus.save = false;
      this.openErrorModal();
    }

  }
}
