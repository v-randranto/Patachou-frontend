import { Relationship } from '@app/data/model/relationship';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '@app/data/model/member';
import { MemberPreviewModalComponent } from '@shared/modal/member-preview-modal/member-preview-modal.component';
import { Subject, Subscription } from 'rxjs';
import { SearchService } from '@app/core/service/search.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SocketIoService } from '@app/core/service/socket-io.service';

const CONFIRMED_STATUS = 'CONFIRMED',
  PENDING_STATUS = 'PENDING';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  public currentMember: Member;
  public previewMember: Member; //membre ou relation sélectionné pour affcihage dans une modale
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
  public searchTerm = '';

  public socketSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private modalService: BsModalService,
    private socketService: SocketIoService
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
        this.currentMember = this.authenticationService.userProfile;
          this.activatedRoute.data.subscribe((data: { network: Relationship[] }) => {
          if (data?.network) {
            this.relations = data.network;
          }
        });
      this.initRelationsTypes();
    } else {
      this.router.navigate(['home']);
    };

    // abonnement au service de recherche de membres
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.members = results;
        if (this.members.length > 0) {
          this.showResults = true;
        }
      });

    // requêtes socket.io pour récupérer la mise à jour d'une relation
    this.socketSubscription = this.socketService.relationUpdate()
    .subscribe(update => {
      console.log('new update', update)
      const index = this.relations.findIndex(relation =>
        JSON.stringify(relation._id) === JSON.stringify(update._id))
        if (index === -1) {
          console.log('index non trouvé')
          throw Error ('index non trouvé')
        } else {
          console.log('index trouvé')
          console.log('relations à mettre à jour', this.relations[index])
          this.relations[index] = update;
          this.initRelationsTypes();
        }
    });
  }

  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }

  // répartition des relations dans différents tableaux selon leur statut : amis confirmés, à valider ou en attente
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

  // déterminer si le membre courant est à l'origine (requester) de la relation
  // cela permet de distinguer les relations à valider de celles en attente
  isRequester(relation: Relationship) {
    return relation.requester._id == this.currentMember._id
  }

  // sélection d'une relation et affichage des données de l'ami dans une modale
  selectRelation(relation: Relationship, relationType: string) {
    this.modalConfig.initialState.selectedRelation = relation;
    this.modalConfig.initialState.relationType = relationType;
    if (this.isRequester(relation)) {
      this.modalConfig.initialState.selectedMember = relation.receiver;
    } else {
      this.modalConfig.initialState.selectedMember = relation.requester;
    }
    this.openModal();
  }

  // sélection d'un membre issu de la recherche et affichage de ses données dans une modale
  selectMember(member: Member) {
    this.modalConfig.initialState.selectedRelation = null;
    this.modalConfig.initialState.selectedMember = member;
    this.modalConfig.initialState.relationType = this.relation_to_befriend;
    this.openModal();
  }

  openModal() {
    this.modalRef = this.modalService.show(MemberPreviewModalComponent, this.modalConfig);
  }
}
