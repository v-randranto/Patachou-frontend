import { AuthenticationGuard } from './core/guard/authentication.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './connection/register/register.component';
import { LoginComponent } from './connection/login/login.component';
import { LogoutComponent } from './connection/logout/logout.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { LostPasswordComponent } from './connection/lost-password/lost-password.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './layout/error/error.component';
import { ProfileResolver } from '@app/profile/profile.resolver';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'connection',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'lostpwd', component: LostPasswordComponent }
    ]
  },
  { path: 'profile',
  component: ProfileComponent,
  canActivate: [AuthenticationGuard],
  resolve: {
    member: ProfileResolver
  } },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
