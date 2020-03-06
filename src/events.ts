import { Global } from "./types";

export enum Events {
  start = 'odo:event:start',
  restart = 'odo:event:restart',
};

export const on = (global: Global) => (event: Events, callback: (data?: object) => void) => {
  global.document.addEventListener(event.toString(), callback);
};

export const off = (global: Global) => (event: Events, callback: (data?: object) => void) => {
  global.document.removeEventListener(event.toString(), callback);
};

export const once = (global: Global) => (event: Events, callback: (data?: object) => void) => {
  const onceCallback = (data?: object): void => {
    callback(data);
    off(global)(event, onceCallback);
  };
  on(global)(event, onceCallback);
};
