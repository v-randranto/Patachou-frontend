import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationModalComponent } from '@shared/modal/notification-modal/notification-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  public modalRef: BsModalRef;
  public notificationModalConfig = {
    animated: true,
    ignoreBackdropClick: true,
    initialState: {
      bgGolor: '#d3d0c6',
      title: 'Session expirée!',
      text: `Veuillez vous connecter à nouveau.`,
      redirection: `/connection/login`
    }
  };
  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private modalService: BsModalService
  ) { }

  openNotificationModal() {
    this.modalRef = this.modalService.show(NotificationModalComponent, this.notificationModalConfig);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authenticationService.isLoggedIn) {
      this.openNotificationModal();
      this.router.navigate(['login']);
    }
    return true;
  }


}