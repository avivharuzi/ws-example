import { first } from 'rxjs/operators';
import { Observable, Subject, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { defaultWsWrapperOptions } from './default-ws-wrapper-options';
import { WsWrapperOptions } from './ws-wrapper-options';

export abstract class WsWrapperRx<T> {
  protected wsSubject: WebSocketSubject<T> | null;
  protected url$: Observable<string>;
  protected options: WsWrapperOptions;

  private connectionClosed: boolean;
  private reconnecting: boolean;
  private messagesSubject: Subject<T>;

  protected constructor(
    url$: Observable<string>,
    options: Partial<WsWrapperOptions> = {}
  ) {
    this.wsSubject = null;
    this.url$ = url$;
    this.options = {
      ...defaultWsWrapperOptions,
      ...options,
    };
    this.connectionClosed = false;
    this.reconnecting = false;
    this.messagesSubject = new Subject<T>();
  }

  get messages$(): Observable<T> {
    return this.messagesSubject.asObservable();
  }

  connect(): void {
    this.connectionClosed = false;

    if (this.wsSubject) {
      return;
    }

    this.url$.pipe(first()).subscribe((url) => {
      this.wsSubject = webSocket({
        url,
        openObserver: {
          next: (event) => {
            this.onopen(event);
          },
        },
        closeObserver: {
          next: (event) => {
            this.onclose(event);
            this.reconnect();
          },
        },
      });

      this.wsSubject.subscribe(
        (message) => {
          this.onmessage(message);
          this.messagesSubject.next(message);
        },
        (error) => {
          this.onerror(error);
          this.reconnect();
        }
      );
    });
  }

  disconnect(): void {
    this.connectionClosed = true;
    if (this.wsSubject) {
      this.wsSubject.complete();
      this.wsSubject = null;
    }
  }

  send(value: T): void {
    if (!this.wsSubject) {
      return;
    }
    this.wsSubject.next(value);
  }

  protected abstract onclose(event: CloseEvent): void;
  protected abstract onerror(event: Event): void;
  protected abstract onmessage(message: T): void;
  protected abstract onopen(event: Event): void;

  private reconnect(): void {
    if (this.connectionClosed || this.reconnecting || !this.options.reconnect) {
      return;
    }
    this.wsSubject = null;
    this.reconnecting = true;
    timer(this.options.reconnectIntervalMs).subscribe(() => {
      if (!this.connectionClosed) {
        this.connect();
      }
      this.reconnecting = false;
    });
  }
}
