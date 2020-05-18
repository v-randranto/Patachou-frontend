import { ProfileModule } from './profile/profile.module';
import { JwtInterceptorService } from './core/service/jwt-interceptor.service';
import { AuthenticationService } from './core/service/authentication.service';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DataModule } from './data/data.module';
import { CoreModule } from './core/core.module';
import { ConnectionModule } from './connection/connection.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChatService } from './chat.service';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { ErrorComponent } from './layout/error/error.component';
import { MemberDataService } from './data/service/member-data.service';
import { ContactComponent } from './contact/contact.component';

const config: SocketIoConfig = {
  url: environment.ws_url,
  options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent,
    AboutComponent,
    ErrorComponent,
    ContactComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    NgbModule,
    FontAwesomeModule,
    ConnectionModule,
    CoreModule,
    DataModule,
    NgbCollapseModule,
    PopoverModule.forRoot(),
    ProfileModule
  ],
  providers: [
    ChatService,
    MemberDataService,
    AuthenticationService,
    JwtInterceptorService,
    {provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
