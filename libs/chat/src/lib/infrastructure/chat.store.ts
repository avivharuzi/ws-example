import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { ChatDataAcceptMessage, ChatUser } from '../entities';

export interface ChatState {
  userDetails: ChatUser | null;
  users: ChatUser[];
  messages: ChatDataAcceptMessage[];
}

const initialState: ChatState = {
  userDetails: null,
  users: [],
  messages: [],
};

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'chat',
})
export class ChatStore extends Store<ChatState> {
  constructor() {
    super(initialState);
  }

  setUserDetails(user: ChatUser): void {
    this.update((state) => {
      return {
        ...state,
        userDetails: user,
      };
    });
  }

  setUsers(users: ChatUser[]): void {
    this.update((state) => {
      return {
        ...state,
        users,
      };
    });
  }

  addUser(user: ChatUser): void {
    this.update((state) => {
      return {
        ...state,
        users: [...state.users, user],
      };
    });
  }

  removeUser(chatUser: ChatUser): void {
    this.update((state) => {
      return {
        ...state,
        users: state.users.filter(
          (user) => user.username !== chatUser.username
        ),
      };
    });
  }

  addMessage(message: ChatDataAcceptMessage) {
    this.update((state) => {
      return {
        ...state,
        messages: [...state.messages, message],
      };
    });
  }
}
