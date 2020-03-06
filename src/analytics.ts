import { dispatch } from "./triggers";
import { Global } from "./types";

export const track = (global: Global) => (key: string, data?: object) : void => {
  dispatch(global)('odo:track', {
    key,
    data,
  });
};
