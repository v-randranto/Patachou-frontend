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
    console.log('>connectMember', member)
    this.socket.emit('connectMember', member);
  }

  // donner ordre au serveur de déconnecter le membre
  disconnectMember() {
    console.log('>disconnectMember')
    this.socket.emit('disconnectMember');
  }

  // recevoir le nb de membres connectés
  getConnectionsNb() {

    return Observable.create((observer) => {
      console.log(this.socket.ioSocket)
      this.socket.on('connectedMembers', (connectionsNb) => {
        observer.next(connectionsNb);
      });
    });
  }

  disconnected() {
    return Observable.create((observer) => {
      console.log(this.socket.ioSocket)
      this.socket.on('disconnect', (reason) => {
        console.log('member disconected');
        observer.next(reason);
        this.socket.ioSocket.connect();
      });
    });
  }
}
