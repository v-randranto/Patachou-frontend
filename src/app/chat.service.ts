import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from './message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  public sendMessage(message) {
    console.log('> chat sendMessage:', message)
    this.socket.emit('message', message);
}
public getMessages = () => {
  return Observable.create((observer) => {
          this.socket.on('message', (message) => {
              observer.next(message);
          });
  });
}

}
