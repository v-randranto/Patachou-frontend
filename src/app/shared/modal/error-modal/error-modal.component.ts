import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  public title = `Oups, il y a une saucisse dans la pâte!`;
  public text = `Nous sommes désolés, un incident est intervenu. Merci de réessayer plus tard.`;
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
