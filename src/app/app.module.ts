import { SharedModule } from '@app/shared/shared.module';
import { SearchService } from '@app/core/service/search.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUpload, faMars, faVenus, faVenusMars, faBirthdayCake, faTimes, faIdBadge, faAt, faPlug, faEnvelope, faSearch, faUserFriends, faPencilAlt, faUsers, faUser, faUserMinus, faUserPlus, faSignOutAlt, faSignInAlt, faInfoCircle, faSmileBeam, faAngleDown, faCaretDown, faColumns, faUserEdit, faComments, faPaperPlane, faInbox, faBullhorn, faUserSecret, faEdit } from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService } from '@core/service/authentication.service';
import { environment } from './../environments/environment';

import { DataModule } from './data/data.module';
import { CoreModule } from '@core/core.module';
import { ConnectionModule } from '@app/connection/connection.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { ErrorComponent } from './layout/error/error.component';
import { MemberDataService } from './data/service/member-data.service';
import { ContactComponent } from './contact/contact.component';
import { MemberModule } from './member/member.module';
import { GlobalErrorHandlerService } from '@core/service/global-error-handler.service';
import { GlobalHttpInterceptorService } from '@app/core/service/global-http-interceptor.service';

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
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    NgbModule,
    NgbCollapseModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    FontAwesomeModule,
    ConnectionModule,
    CoreModule,
    DataModule,
    MemberModule,
    SharedModule
  ],
  providers: [
    MemberDataService,
    AuthenticationService,
    SearchService,
    { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUpload, faMars, faVenus, faVenusMars, faBirthdayCake, faTimes, faIdBadge, faAt, faPlug, faEnvelope, faSearch, faUserFriends, faPencilAlt, faUsers, faUser, faUserMinus, faUserPlus, faSignOutAlt, faSignInAlt, faInfoCircle, faSmileBeam, faAngleDown, faCaretDown, faColumns, faUserEdit, faEnvelope, faComments, faPaperPlane, faInbox, faBullhorn, faUserSecret, faEdit);
  }
}
