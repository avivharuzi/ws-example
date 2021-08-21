import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';

import { ChatMessage } from '@ws-example/chat';
import { WsWrapperRx } from '@ws-example/ws-wrappers';

import { CHAT_SERVICE_CONFIG, ChatServiceConfig } from '../application';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends WsWrapperRx<ChatMessage> {
  constructor(@Inject(CHAT_SERVICE_CONFIG) config: ChatServiceConfig) {
    super(of(config.wsUrl));
  }

  protected onclose(): void {
    return;
  }

  protected onerror(): void {
    return;
  }

  protected onmessage(): void {
    return;
  }

  protected onopen(): void {
    return;
  }
}
