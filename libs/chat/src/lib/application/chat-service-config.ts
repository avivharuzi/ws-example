import { InjectionToken } from '@angular/core';

export interface ChatServiceConfig {
  wsUrl: string;
}

export const CHAT_SERVICE_CONFIG = new InjectionToken<ChatServiceConfig>(
  'chat.service.config'
);
