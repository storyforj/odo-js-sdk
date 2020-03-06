import { Global } from "./types";

export const Triggers = {
  ready: 'odo:trigger:ready',
  finish: 'odo:trigger:finish',
};

export const dispatch = (global: Global) => (trigger: string, data?: object) => {
  global.postMessage({
    event: trigger,
    data,
  }, '*');
};
