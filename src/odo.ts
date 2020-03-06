import { EventEmitter } from 'events';

import * as events from './events';
import * as triggers from './triggers';
import { Global, ODOStorage } from './types';

export type Odo = {
  events: events.ODOEmitter,
  trigger: (trigger: string, data?: object | undefined) => void,
  /**
   * Removes all listeners and connections to the DOM.
   */
  destroy: () => void,
  version: string,
}

export const Events = events.Events;
export const Triggers = triggers.Triggers;

export const init = (global?: Global) : Odo => {
  const fakeGlobalEventListener: EventEmitter = new EventEmitter();
  let theGlobal = global || {
    navigator: { userAgent: 'n/a' },
    document: {
      addEventListener: fakeGlobalEventListener.on,
      removeEventListener: fakeGlobalEventListener.off,
    },
    postMessage: (message: { event: 'string', data: any }) => {
      if (message.event === triggers.Triggers.ready) {
        emitter.emit(events.Events.start, message.data);
      }
      if (message.event === triggers.Triggers.finish) {
        emitter.emit(events.Events.restart, message.data);
      }
    },
  };

  const isInOdo = theGlobal.navigator.userAgent.indexOf('odo') > -1;
  if (typeof window !== 'undefined' && isInOdo) {
    theGlobal = window as Global;
  }

  let odoStorage = new ODOStorage();
  const emitter = new events.ODOEmitter(odoStorage);

  function handleOdoMessage(dataString: string) {
    const data = JSON.parse(dataString);
    if ((data.isODO ?? false) && typeof data.event === 'string') {
      emitter.emit(data.event, data.args);
    }
  }

  theGlobal.document.addEventListener('message', handleOdoMessage);

  return {
    events: emitter,
    trigger: triggers.dispatch(theGlobal),
    destroy: () => {
      emitter.removeAllListeners();
      theGlobal.document.removeEventListener('message', handleOdoMessage);
    },
    version: '__version__',
  };
};

