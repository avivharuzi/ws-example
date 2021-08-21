import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { ChatState, ChatStore } from './chat.store';

@Injectable({
  providedIn: 'root',
})
export class ChatQuery extends Query<ChatState> {
  messages$ = this.select((state) => state.messages);
  userDetails$ = this.select((state) => state.userDetails);
  users$ = this.select((state) => state.users);

  constructor(protected store: ChatStore) {
    super(store);
  }
}
