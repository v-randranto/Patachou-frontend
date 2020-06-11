import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModalComponent } from './modal/notification-modal/notification-modal.component';
import { ErrorModalComponent } from './modal/error-modal/error-modal.component';
import { MemberPreviewModalComponent } from './modal/member-preview-modal/member-preview-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomTitleCasePipe } from './custom-pipe/custom-title-case.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CustomTitleCasePipe,
    NotificationModalComponent,
    ErrorModalComponent,
    MemberPreviewModalComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NotificationModalComponent,
    ErrorModalComponent,
    MemberPreviewModalComponent,
    CustomTitleCasePipe
  ]
})
export class SharedModule { }
