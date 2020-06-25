import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ERROR_NOTIFICATION } from '@app/shared/constant/notification-modal';
import { AuthenticationService } from '@app/core/service/authentication.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  public title = ERROR_NOTIFICATION.title;
  public text = ERROR_NOTIFICATION.text;
  public logout: string;
  public redirection: string;

  constructor(
    public modalRef: BsModalRef,
    private router: Router,
    private authenticationService: AuthenticationService
    ) { }

  closeModal() {
    this.modalRef.hide();
    if (this.redirection) {
      if (this.logout) {
        this.authenticationService.logout();
      }
      this.router.navigate([this.redirection]);
    }
  }

}
