import { Relationship } from '@app/data/model/relationship';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '@app/data/model/member';
import { MemberPreviewModalComponent } from '@shared/modal/member-preview-modal/member-preview-modal.component';
import { Subject } from 'rxjs';
import { SearchService } from '@app/core/service/search.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

const CONFIRMED_STATUS = 'CONFIRMED',
  PENDING_STATUS = 'PENDING';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  public previewMember: Member;
  public currentMember: Member;
  public relations: Relationship[] = [];
  public confirmedRelations: Relationship[] = [];
  public relationsInWaiting: Relationship[] = [];
  public relationsToValidate: Relationship[] = [];
  public relation_confirmed = 'CONFIRMED';
  public relation_in_waiting = 'IN_WAITING';
  public relation_to_validate = 'TO_VALIDATE';
  public relation_to_befriend = 'TO_BEFRIEND';
  public modalRef: BsModalRef;

  public modalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      selectedRelation: null,
      selectedMember: null,
      relationType: ''
    }
  };


  // variables recherche de membres
  public members: any;
  public searchSubmitted = false;
  public results: any;
  public showResults = false;
  public searchTerm$ = new Subject<string>();

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      if (this.authenticationService.userProfile) {
        this.currentMember = this.authenticationService.userProfile;
      } else {
        this.authenticationService.logout();
        this.router.navigate(['connection/login']);
      }
      if (this.authenticationService.userRelationships) {
        this.relations = this.authenticationService.userRelationships;
      } else {
        this.activatedRoute.data.subscribe((data: { network: Relationship[] }) => {
          console.log(data.network);
          if (data?.network) {
            this.relations = data.network;
            this.authenticationService.setUserRelationships(this.relations);
          }
        });
      }
      this.initRelationsTypes();
    } else {
      this.router.navigate(['home']);
    };

    // service de recherche de membres
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.members = results;
        if (this.members.length > 0) {
          this.showResults = true;
        }
      });
  }

  initRelationsTypes() {
    this.confirmedRelations = this.relations.filter(relation => relation.status == CONFIRMED_STATUS);
    this.relationsInWaiting = this.relations.filter(relation =>
      (relation.status == PENDING_STATUS) && this.isRequester(relation));
    this.relationsToValidate = this.relations.filter(relation =>
      (relation.status == PENDING_STATUS) && !this.isRequester(relation));
  }

  // ne plus afficher le résultat de la recherche d'amis
  closeResults() {
    this.showResults = false;
  }

  // check si le membre courant est à l'origine (requester) de la relation
  isRequester(relation: Relationship) {
    return relation.requester._id == this.currentMember._id
  }
  // sélection d'une relation
  selectRelation(relation: Relationship, relationType: string) {
    console.log('selectedRelation', relation);
    this.modalConfig.initialState.selectedRelation = relation;
    this.modalConfig.initialState.relationType = relationType;
    if (this.isRequester(relation)) {
      this.modalConfig.initialState.selectedMember = relation.receiver;
    } else {
      this.modalConfig.initialState.selectedMember = relation.requester;
    }
    this.openModal();
  }


  // sélection d'un membre issu de la recherche
  selectMember(member: Member) {
    console.log('selectedMember', member);
    this.modalConfig.initialState.selectedRelation = null;
    this.modalConfig.initialState.selectedMember = member;
    this.modalConfig.initialState.relationType = this.relation_to_befriend;
    this.openModal();
  }


  // affichage du membre sélectionné
  openModal() {
    this.modalRef = this.modalService.show(MemberPreviewModalComponent, this.modalConfig);
  }
}
