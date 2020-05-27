import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  constructor(private socket: Socket) { }

  public connectMember(member) {
    this.socket.emit('connectMember', member);
  }

  public disconnectMember() {
    this.socket.emit('disconnectMember');
  }

  public getConnectionsNb = () => {
    return Observable.create((observer) => {
      this.socket.on('connectedMembers', (connectionsNb) => {
        observer.next(connectionsNb);
      });
    });
  }
}
