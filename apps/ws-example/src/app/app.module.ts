import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ChatModule } from '@ws-example/chat';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ChatModule.forRoot({
      wsUrl: environment.wsUrl,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
