import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChatFacade } from '@ws-example/chat';

@Component({
  selector: 'ws-example-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  messages$ = this.chatFacade.messages$;
  userDetails$ = this.chatFacade.userDetails$;
  users$ = this.chatFacade.users$;

  connect$ = this.chatFacade.connect();

  constructor(private chatFacade: ChatFacade) {}

  sendMessage(value: string): void {
    this.chatFacade.sendMessage(value);
  }
}
