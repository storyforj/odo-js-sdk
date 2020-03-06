import { createEventBus } from './eventBus';
import { Global } from './types';
import * as events from './events';

export type Odo = {
  /**
   * A way to trigger events in unit testing scenarios. Has no effect in production apps.
   */
  __triggerForTesting: (event: events.Events, data?: object) => boolean,
  /**
   * Listen to an event from the ODO app.
   */
  on: (event: events.Events, callback: (data?: object) => void) => void,
  /**
   * Stops listening to an event from the ODO app. Requires both event and callback to unregistered the listener.
   */
  off: (event: events.Events, callback: (data?: object) => void) => void,
  /**
   * Listen to an ODO event once, then stop listening immediately.
   */
  once: (event: events.Events, callback: (data?: object) => void) => void,
}

export const Events = events.Events;

export const init = () : Odo => {
  const simpleBus = createEventBus();
  let global: Global = {
    navigator: { userAgent: 'n/a' },
    document: {
      addEventListener: simpleBus.listen,
      removeEventListener: simpleBus.removeListener,
    },
  };

  const isInOdo = global.navigator.userAgent.indexOf('odo') > -1;

  if (typeof window !== 'undefined' && isInOdo) {
    global = window as Global;
  }

  return {
    __triggerForTesting: simpleBus.trigger,
    on: events.on(global),
    off: events.off(global),
    once: events.once(global),
  };
};

