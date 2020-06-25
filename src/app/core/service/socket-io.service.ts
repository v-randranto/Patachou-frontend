import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  constructor(private socket: Socket) { }

  // donner ordre au serveur de compter le membre parmi les connectés au site
  addMember(member) {
    this.socket.emit('login', member);
  }

  // donner ordre au serveur de soustraire le membre des connectés au site
  subtractMember() {
    this.socket.emit('logout');
  }

  // notification du nb de membres connectés au site
  getLoggedInNb() {
    return Observable.create((observer) => {
      this.socket.on('loggedIn', (loggedInNb) => {
        observer.next(loggedInNb);
      });
    });
  }

  // notification de la déconnexion de la socket => demander une reconnexion
  disconnected() {
    return Observable.create((observer) => {
      this.socket.on('disconnected', (reason) => {
        console.log('member disconnected reason', reason);
        this.socket.ioSocket.connect();
      });
    });
  }

  // mise à jour d'une relation en base
  updateRelation(data) {
    console.log('>updateRelation', data);
    this.socket.emit('updateRelation', data);
  }

  // notification de la màj d'une relation en base
  relationUpdate(){
    return Observable.create((observer) => {
      this.socket.on('relationUpdate', (relation) => {
        console.log('>relationUpdate', relation);
        observer.next(relation);
      });
    });
  }

}
