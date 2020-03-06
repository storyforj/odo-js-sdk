import { EventEmitter } from 'events';

import { version } from '../package.json';
import * as events from './events';
import { Global, ODOStorage } from './types';

export type Odo = {
  events: events.ODOEmitter,
  /**
   * Removes all listeners and connections to the DOM.
   */
  destroy: () => void,
  version: string,
}

export const Events = events.Events;

export const init = () : Odo => {
  const fakeGlobalEventListener: EventEmitter = new EventEmitter();
  let global: Global = {
    navigator: { userAgent: 'n/a' },
    document: {
      addEventListener: fakeGlobalEventListener.on,
      removeEventListener: fakeGlobalEventListener.off,
    },
  };
  const isInOdo = global.navigator.userAgent.indexOf('odo') > -1;
  if (typeof window !== 'undefined' && isInOdo) {
    global = window as Global;
  }

  let odoStorage = new ODOStorage();
  const emitter = new events.ODOEmitter(odoStorage);

  function handleOdoMessage(dataString: string) {
    const data = JSON.parse(dataString);
    if ((data.isODO ?? false) && typeof data.event === 'string') {
      emitter.emit(data.event, data.args);
    }
  }

  global.document.addEventListener('message', handleOdoMessage);

  return {
    events: emitter,
    destroy: () => {
      emitter.removeAllListeners();
      global.document.removeEventListener('message', handleOdoMessage);
    },
    version,
  };
};

