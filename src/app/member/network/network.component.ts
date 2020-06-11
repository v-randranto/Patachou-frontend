import { Relationship } from '@app/data/model/relationship';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '@app/data/model/member';
import { MemberPreviewModalComponent } from '@shared/modal/member-preview-modal/member-preview-modal.component';
import { Subject } from 'rxjs';
import { SearchService } from '@app/core/service/search.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  public member: Member;
  public relations: Relationship[] = [];
  public confirmedRelations: Relationship[] = [];
  public relationsInWaiting: Relationship[] = [];
  public relationsToValidate: Relationship[] = [];
  public modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
    initialState: {
      selectedMember: new Member()
    }
  };

  // variables recherche de membres
  public members = [];
  public searchSubmitted = false;
  public results: any;
  public showResults = false;
  public searchTerm$ = new Subject<string>();


  constructor(
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn) {
      if (this.authenticationService.userProfile) {
        this.member = this.authenticationService.userProfile;
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
      this.confirmedRelations = this.relations.filter(relation => relation.status == "CONFIRMED");
      console.log("confirmés", this.confirmedRelations);
      this.relationsInWaiting = this.relations.filter(relation =>
        (relation.status == "PENDING") && (relation.requester._id == this.member._id));
      console.log("en attente", this.relationsInWaiting);
      this.relationsToValidate = this.relations.filter(relation =>
        (relation.status == "PENDING") && (relation.receiver._id == this.member._id));
      console.log("à valider", this.relationsToValidate);
    } else {
      this.router.navigate(['home']);
    };

    // service de recherche de membres
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        console.log('>searchService.search form');
        this.results = results;
        if (this.results.length > 0) {
          this.showResults = true;
        }
        console.log('>searchService.search results', this.results);
      });
  }

  /*====================================================================*
   * gestion recherche de membres
   *====================================================================*/
  // sélection d'un membre issu de la recherche
  selectMember(member) {
    console.log(member);
    this.modalConfig.initialState.selectedMember = member;
    this.openModal();
  }
  // ne plus afficher le résultat
  closeResults() {
    console.log('> closeResults');
    this.showResults = false;
  }

/*====================================================================*
   * gestion demande d'ajout d'ami
   *====================================================================*/
// affichage résultat de la recherche de membres
  openModal() {
    this.modalRef = this.modalService.show(MemberPreviewModalComponent, this.modalConfig);
  }




}
