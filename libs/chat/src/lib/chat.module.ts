import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CHAT_SERVICE_CONFIG, ChatServiceConfig } from './application';

@NgModule()
export class ChatModule {
  constructor(@Optional() @SkipSelf() parentModule?: ChatModule) {
    if (parentModule) {
      throw new Error(
        'ChatModule is already loaded. Import it in the AppModule only!'
      );
    }
  }

  static forRoot(config: ChatServiceConfig): ModuleWithProviders<ChatModule> {
    return {
      ngModule: ChatModule,
      providers: [
        {
          provide: CHAT_SERVICE_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
