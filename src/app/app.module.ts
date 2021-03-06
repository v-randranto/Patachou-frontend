import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DataModule } from './data/data.module';
import { CoreModule } from './core/core.module';
import { ConnectionModule } from './connection/connection.module';
import { ChatService } from './chat.service';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { ErrorComponent } from './layout/error/error.component';
import { MemberDataService } from './data/service/member-data.service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent,
    AboutComponent,
    ErrorComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    NgbModule,
    ConnectionModule,
    CoreModule,
    DataModule
  ],
  providers: [
    ChatService,
    MemberDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
