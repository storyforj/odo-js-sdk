import { Global } from "./types";
import { dispatch } from "./triggers";

function getRandomInt(max : number = 10000000000): number {
  return Math.floor(Math.random() * Math.floor(max));
}

export const save = (global: Global, saveType: string) => (key: string, data: object) : Promise<object> => {
  return new Promise((resolve, reject) => {
    const returnEvent = `odo:data:saveResponse:${getRandomInt()}`;
    const handleResponse = (customEvent: CustomEvent) => {
      const data: any = JSON.parse(customEvent.detail);
      if (data.event !== returnEvent) { return; }
      if (data.success) {
        resolve(data);
      } else {
        reject(data)
      }
    };
    global.document.addEventListener('message', handleResponse);
    dispatch(global)(`odo:data:${saveType}`, {
      returnEvent,
      key,
      data,
    });
  });
};

export const get = (global: Global, getType: string) => (key: string) : Promise<object> => {
  return new Promise((resolve, reject) => {
    const returnEvent = `odo:data:getResponse:${getRandomInt()}`;
    const handleResponse = (customEvent: CustomEvent) => {
      const data: any = JSON.parse(customEvent.detail);
      if (data.event !== returnEvent) { return; }
      if (data.success) {
        resolve(data);
      } else {
        reject(data)
      }
    };
    global.document.addEventListener('message', handleResponse);
    dispatch(global)(`odo:data:${getType}`, {
      returnEvent,
      key,
    });
  });
};
