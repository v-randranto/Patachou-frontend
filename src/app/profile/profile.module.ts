import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { ProfileResolver } from './profile.resolver';

const routes: Routes = [];

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    [RouterModule.forChild(routes)]
  ],
  providers: [ProfileResolver]
})
export class ProfileModule { }
