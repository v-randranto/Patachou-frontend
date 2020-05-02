import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public newMessage: string ;
  public count: number = 0;
  public messageList:  string[] = [];

  constructor(private chatService: ChatService) {
  }

  sendMessage() {
    this.newMessage = 'message ' + ++this.count;
    console.log('count:', this.count);
    this.chatService.sendMessage(this.newMessage);
  }
  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messageList.push(message);
      });
  }
}
