import { NetworkResolver } from './network/network.resolver';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { MemberResolver } from '../member/member.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from '@app/member/profile/profile.component';
import { NetworkComponent } from './network/network.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '@app/shared/shared.module';

const routes: Routes = [];

@NgModule({
  declarations: [
    ProfileComponent,
    DashboardComponent,
    NetworkComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TabsModule.forRoot(),
    [RouterModule.forChild(routes)],
    SharedModule
  ],
  providers: [
    MemberResolver,
    NetworkResolver
  ]
})
export class MemberModule { }
