import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { MemberResolver } from '../member/member.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from '@app/member/profile/profile.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    ProfileComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    [RouterModule.forChild(routes)]
  ],
  providers: [MemberResolver]
})
export class MemberModule { }
