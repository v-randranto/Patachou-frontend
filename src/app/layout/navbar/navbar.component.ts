import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { AuthenticationService } from '@app/core/service/authentication.service';
import { SocketIoService } from '@app/core/service/socket-io.service';
import { faPlug, faEnvelope, faSearch, faUserFriends, faPencilAlt, faUsers, faUser, faUserMinus, faUserPlus, faSignOutAlt, faSignInAlt, faInfoCircle, faSmileBeam, faAngleDown, faCaretDown, faColumns, faVenus, faMars, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { Subject, Observable } from 'rxjs';
import { SearchService } from '@app/core/service/search.service';
import { Member } from '@app/data/model/member';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('viewMember') memberRef: TemplateRef<any>;
  @HostListener('document:click')
  onClick() {
    console.log(`onClick`);
    this.showResults = false;
  }
  public modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };
  observable: Observable<boolean>;
  // icones menu
  public searchIcon = faSearch;
  public friendsIcon = faUserFriends;
  public messagingIcon = faEnvelope;
  public postingIcon = faPencilAlt;
  public dashboardIcon = faColumns;
  public profileIcon = faUser;
  public networkIcon = faUsers;
  public registerIcon = faUserPlus;
  public loginIcon = faSignInAlt;
  public logoutIcon = faSignOutAlt;
  public infoIcon = faInfoCircle;
  public aboutIcon = faSmileBeam;
  public submenuIcon = faCaretDown;
  public connectedIcon = faPlug;
  public femaleIcon = faVenus;
  public maleIcon = faMars;
  public otherIcon = faVenusMars;

  // nombre de membres connectés
  public connectedNb;
  public member;
  public selectedMember;

  // variables recherche de membres
  public members = [];
  public searchSubmitted = false;
  public results: any;
  public showResults = false;
  public searchTerm$ = new Subject<string>();

  // menu
  public isMenuCollapsed = true;

  constructor(
    public authenticationService: AuthenticationService,
    private socketService: SocketIoService,
    private searchService: SearchService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // récup données du membre s'il est connecté
    if (this.authenticationService.isLoggedIn) {
      console.log('> onInit membre connecté');
      if (this.authenticationService.userProfile) {
        console.log('> onInit user profile', this.authenticationService.userProfile);
        this.member = this.authenticationService.userProfile;
      } else {
        console.log('> onInit NO user profile');
      }
    } else {
      console.log('> onInit membre DEconnecté');
    }
    
    // requêtes socket.io pour récupérer nombre de membres connectés
    this.socketService
      .getConnectionsNb()
      .subscribe((res) => {
        this.connectedNb = res;
      });

    this.socketService
      .disconnected()
      .subscribe((res) => {
        console.log('>disconnected', res)
        this.connectedNb++;
      });

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

  ngOnDestroy(): void {
    this.socketService.getConnectionsNb().unsuscribe();
    // this.checkLogin().unsubscribe();
  }

  logout() {
    this.authenticationService.logout();
    this.menuCollapse();
  }

  menuCollapse() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }


  /*====================================================================*
   * gestion recherche de membres
   *====================================================================*/
  // sélection d'un membre issu de la recherche
  selectMember(member) {
    console.log(member);
    this.selectedMember = member;
    this.openModal(this.memberRef);
  }
  // ne plus afficher le résultat
  closeResults() {
    console.log('> closeResults');
    this.showResults = false;
  }

  // affichage du membre sélectionné dans une modale
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
  closeModal() {
    this.modalRef.hide();
  }
  // faire une demande d'ami sur le membre sélectionné
  friendRequest() {
    console.log('> friend request', this.selectedMember);
  }

}
