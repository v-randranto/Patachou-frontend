import { SearchService } from '@app/core/service/search.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthenticationService } from '@core/service/authentication.service';
import { environment } from './../environments/environment';

import { DataModule } from './data/data.module';
import { CoreModule } from '@core/core.module';
import { ConnectionModule } from '@app/connection/connection.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';

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
    ContactComponent
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
    PopoverModule.forRoot(),
    AccordionModule.forRoot(),
    FontAwesomeModule,
    ConnectionModule,
    CoreModule,
    DataModule,
    MemberModule
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
export class AppModule { }
