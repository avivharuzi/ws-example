import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ChatMessageType } from '../entities';
import { ChatQuery } from '../infrastructure';
import { ChatService } from '../infrastructure';
import { ChatStore } from '../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class ChatFacade {
  users$ = this.chatQuery.users$;
  userDetails$ = this.chatQuery.userDetails$;
  messages$ = this.chatQuery.messages$;

  constructor(
    private chatQuery: ChatQuery,
    private chatService: ChatService,
    private chatStore: ChatStore
  ) {}

  connect(): Observable<boolean> {
    this.chatService.connect();
    return this.chatService.messages$.pipe(
      tap((message) => {
        const { type, data } = message;
        switch (type) {
          case ChatMessageType.UsersList:
            if (data.usersList?.users) {
              this.chatStore.setUsers(data.usersList.users);
            }
            break;
          case ChatMessageType.UserDetails:
            if (data.userDetails?.user) {
              this.chatStore.setUserDetails(data.userDetails.user);
            }
            break;
          case ChatMessageType.UserJoin:
            if (data.userJoin?.user) {
              this.chatStore.addUser(data.userJoin.user);
            }
            break;
          case ChatMessageType.UserLeave:
            if (data.userLeave?.user) {
              this.chatStore.removeUser(data.userLeave.user);
            }
            break;
          case ChatMessageType.AcceptMessage:
            if (data.acceptMessage) {
              this.chatStore.addMessage(data.acceptMessage);
            }
            break;
        }
      }),
      switchMap(() => of(true))
    );
  }

  disconnect(): void {
    this.chatService.disconnect();
  }

  sendMessage(content: string): void {
    this.chatService.send({
      type: ChatMessageType.SendMessage,
      data: {
        sendMessage: {
          content,
        },
      },
    });
  }
}
