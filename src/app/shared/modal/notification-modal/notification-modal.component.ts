import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent {
  public title: string;
  public text: string;
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
