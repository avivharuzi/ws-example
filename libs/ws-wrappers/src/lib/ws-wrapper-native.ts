import { first } from 'rxjs/operators';
import { Observable, Subject, timer } from 'rxjs';

import { defaultWsWrapperOptions } from './default-ws-wrapper-options';
import { WsWrapperOptions } from './ws-wrapper-options';

export abstract class WsWrapperNative<T> {
  protected ws: WebSocket | null;
  protected url$: Observable<string>;
  protected options: WsWrapperOptions;

  private connectionClosed: boolean;
  private reconnecting: boolean;
  private messagesSubject: Subject<T>;

  protected constructor(
    url$: Observable<string>,
    options: Partial<WsWrapperOptions> = {}
  ) {
    this.ws = null;
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

    if (this.ws) {
      return;
    }

    this.url$.pipe(first()).subscribe((url) => {
      this.ws = new WebSocket(url);
      this.ws.onclose = (event) => {
        this.onclose(event);
        this.reconnect();
      };
      this.ws.onerror = (error) => {
        this.onerror(error);
        this.reconnect();
      };
      this.ws.onmessage = (event) => {
        this.onmessage(event);
        const data = JSON.parse(event.data);
        this.messagesSubject.next(data);
      };
      this.ws.onopen = (event) => {
        this.onopen(event);
      };
    });
  }

  disconnect(): void {
    this.connectionClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send<U>(value: U): void {
    if (!this.ws) {
      return;
    }
    this.ws.send(JSON.stringify(value));
  }

  protected isConnecting(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.CONNECTING);
  }

  protected isOpen(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.OPEN);
  }

  protected isClosing(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.CLOSING);
  }

  protected isClosed(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.CLOSED);
  }

  protected abstract onclose(event: CloseEvent): void;
  protected abstract onerror(event: Event): void;
  protected abstract onmessage(event: MessageEvent): void;
  protected abstract onopen(event: Event): void;

  private reconnect(): void {
    if (this.connectionClosed || this.reconnecting || !this.options.reconnect) {
      return;
    }
    this.ws = null;
    this.reconnecting = true;
    timer(this.options.reconnectIntervalMs).subscribe(() => {
      if (!this.connectionClosed) {
        this.connect();
      }
      this.reconnecting = false;
    });
  }
}
