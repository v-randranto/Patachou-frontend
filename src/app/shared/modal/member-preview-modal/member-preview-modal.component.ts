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

  // types de relation possibles (relationType)
  public relation_confirmed = 'CONFIRMED';
  public relation_in_waiting = 'IN_WAITING';
  public relation_to_validate = 'TO_VALIDATE';
  public relation_to_befriend = 'TO_BEFRIEND';
  // statuts possibles de la relation
  public status_confirmed = 'CONFIRMED';
  public status_rejected = 'REJECTED'
  public status_terminated = 'TERMINATED'

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
    initialState: undefined
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

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.relations = this.authenticationService.userRelationships;
    console.log('onInit', this.relations)
    this.currentMember = this.authenticationService.userProfile;
    console.log('currentMember', this.currentMember)
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

  valueInitialState(dataStatus) {
    let text: string;
    switch (dataStatus) {
      case this.status_confirmed:
        text = `Vous êtes pote avec ${this.toTitleCase(this.selectedMember.pseudo)}.`;
        break;
      case this.status_rejected:
        text = `La demande de ${this.toTitleCase(this.selectedMember.pseudo)} est rejetée.`;
        break;
      case this.status_terminated:
        text = `Vous n'êtes plus pote avec ${this.toTitleCase(this.selectedMember.pseudo)}.`;
        break;
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

  toTitleCase(value: string): string {
    return value.toLowerCase().replace(/(?:^|\s|\/|\-)\w/g, (match) => {
      return match.toUpperCase();
    });
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
          const initialState = {
            bgColor: '#a5d152',
            title: 'A y est, demande prise en compte!',
            text: `${this.toTitleCase(this.selectedMember.pseudo)} est notifié.e de votre demande.`
          }
          this.notificationModalConfig.initialState = initialState;
          this.openNotificationModal();
        }
      }, error => {
        this.requestStatus.save = false;
        this.openErrorModal();
      });
  }

  // traiter la màj de la relation suite à confirmation, rejet ou suppression
  relationUpdate(status: string) {
    console.log('> relationUpdate', status)
    const data = {
      id: this.selectedRelation._id,
      status: status,
      modificationAuthor: this.currentMember._id
    }
    this.relationDataService.update(data).
      subscribe(res => {
        console.log('updatedRelation from server', res)
        // this.updateRelations(res);
        this.valueInitialState(data.status);
        this.openNotificationModal();

      }, error => {
        this.updateStatus.save = false;
        this.openErrorModal();
      });
  }
}
