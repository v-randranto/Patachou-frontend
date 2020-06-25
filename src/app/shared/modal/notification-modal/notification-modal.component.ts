import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/service/authentication.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent {
  public color: string;
  public title: string;
  public text: string;
  public redirection: string;
  public logout: string
  public colorStyle: string;

  constructor(
    public modalRef: BsModalRef,
    private router: Router,
    private authenticationService: AuthenticationService) { }

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
