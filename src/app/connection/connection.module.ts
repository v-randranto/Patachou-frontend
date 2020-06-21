import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LostPasswordComponent } from './lost-password/lost-password.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
    ProgressbarModule.forRoot(),
    BsDatepickerModule.forRoot(),
    [RouterModule.forChild(routes)],
    SharedModule
  ],
})
export class ConnectionModule {}
