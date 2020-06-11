import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

const routes: Routes = [];

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    LostPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    [RouterModule.forChild(routes)],
    SharedModule
  ],
})
export class ConnectionModule {}
