import { EventEmitter } from 'events';

import { ODOStorage } from './types';

export const Events = {
  start: 'odo:event:start',
  restart: 'odo:event:restart',
};

export class ODOEmitter extends EventEmitter {
  private storage: ODOStorage;

  constructor(storage: ODOStorage) {
    super();
    this.storage = storage;
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    EventEmitter.prototype.on.call(this, event.toString(), listener);
    if (event === Events.start && this.storage.isStarted) {
      listener();
    }
    return this;
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this {
    EventEmitter.prototype.removeListener.call(this, event.toString(), listener);
    return this;
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    const result = EventEmitter.prototype.emit.call(this, event.toString(), ...args);
    if (event === Events.start) {
      this.storage.isStarted = true;
    }
    return result;
  }
};
