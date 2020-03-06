import { EventEmitter } from 'events';

import * as data from './data';
import * as events from './events';
import * as triggers from './triggers';
import { Global, ODOStorage } from './types';
import { track } from './analytics';

export type Odo = {
  events: events.ODOEmitter,
  data: {
    save: (key: string, data: object) => Promise<object>,
    saveForPlayer: (key: string, data: object) => Promise<object>,
    get: (key: string) => Promise<object>,
    getForPlayer: (key: string) => Promise<object>,
  },
  track: (key: string, data?: object | undefined) => void,
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
      addEventListener: fakeGlobalEventListener.on.bind(fakeGlobalEventListener),
      removeEventListener: fakeGlobalEventListener.off.bind(fakeGlobalEventListener),
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
    data: {
      save: data.save(theGlobal, 'save'),
      saveForPlayer: data.save(theGlobal, 'saveForPlayer'),
      get: data.get(theGlobal, 'get'),
      getForPlayer: data.get(theGlobal, 'getForPlayer'),
    },
    track: track(theGlobal),
    destroy: () => {
      emitter.removeAllListeners();
      theGlobal.document.removeEventListener('message', handleOdoMessage);
    },
    version: '__version__',
  };
};

