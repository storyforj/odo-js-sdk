import { ICallback } from "./types";

export type EventBus = {
  listen: (event: string, callback: ICallback) => void;
  trigger: (event: string, data?: object) => boolean;
  removeListener: (event: string, callback: ICallback) => void;
};

/**
 * This event bus is only used for testing environments. That is anything outside of the ODO app.
 * Within the app, we use document.addEventListener and friends.
 */
export const createEventBus = () : EventBus => {
  let events = {};

  const eventBus: EventBus = {
    listen: ((event: string, callback: ICallback): void => {
      if (!events[event]) { events[event] = []; }
      events[event].push(callback);
    }),
    trigger: (event: string, data?: object): boolean => {
      if (!events[event]) { return false; }
      events[event].forEach((fn: (data?: object) => void) => fn(data));
      return true;
    },
    removeListener: (event: string, callback: ICallback): void => {
      if (!events[event]) { return; }
      events[event].forEach((fn: (data?: object) => void, i: number) => {
        if (fn === callback) {
          events[event].splice(i, 1);
        }
      });
    },
  };

  return eventBus;
};
