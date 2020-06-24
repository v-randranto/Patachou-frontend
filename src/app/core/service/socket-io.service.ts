import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  constructor(private socket: Socket) { }

  // donner ordre au serveur de compter le membre parmi les connectés
  connectMember(member) {
    this.socket.emit('connectMember', member);
  }

  // donner ordre au serveur de déconnecter le membre
  disconnectMember() {
    this.socket.emit('disconnectMember');
  }

  // recevoir le nb de membres connectés
  getConnectionsNb() {

    return Observable.create((observer) => {
      this.socket.on('connectedMembers', (connectionsNb) => {
        observer.next(connectionsNb);
      });
    });
  }

  disconnected() {
    return Observable.create((observer) => {
      this.socket.on('disconnect', (reason) => {
        console.log('member disconected');
        this.socket.ioSocket.connect();
      });
    });
  }
}
