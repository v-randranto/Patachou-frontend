import { NetworkResolver } from './network/network.resolver';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from '@app/member/profile/profile.component';
import { NetworkComponent } from './network/network.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '@app/shared/shared.module';
import { EditCredentialsComponent } from './modal/edit-credentials/edit-credentials.component';
import { EditPersonalDataComponent } from './modal/edit-personal-data/edit-personal-data.component';
import { ChatComponent } from './modal/chat/chat.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    ProfileComponent,
    NetworkComponent,
    EditCredentialsComponent,
    EditPersonalDataComponent,
    ChatComponent,
    DiscussionComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TabsModule.forRoot(),
    [RouterModule.forChild(routes)],
    SharedModule
  ],
  providers: [
    NetworkResolver
  ]
})
export class MemberModule { }
