import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ERROR_NOTIFICATION } from '@app/shared/constant/notification-modal';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  public title = ERROR_NOTIFICATION.title;
  public text = ERROR_NOTIFICATION.text;
  public redirection: string;

  constructor(
    public modalRef: BsModalRef,
    private router: Router) { }

  closeModal() {
    this.modalRef.hide();
    if (this.redirection) {
      this.router.navigate([this.redirection]);
    }
  }

}
