export interface ICallback {
	(data?: object) : void;
}

export interface IListenerCallback {
	(event: CustomEvent) : void;
}

export interface Global {
  document: {
    addEventListener: (event: string, callback: IListenerCallback) => void,
    removeEventListener: (event: string, callback: IListenerCallback) => void,
  };
  navigator: { userAgent: string },
  postMessage: ((message: string, targetOrigin: string, transfer?: Transferable[] | undefined) => void) & ((message: any, targetOrigin: string, transfer?: Transferable[] | undefined) => void)
  ReactNativeWebView?: {
    postMessage: ((message: string, targetOrigin: string, transfer?: Transferable[] | undefined) => void) & ((message: any, targetOrigin: string, transfer?: Transferable[] | undefined) => void),
  }
}

export class ODOStorage {
  public isStarted: boolean = false;
};

export type DataOutput = {
  isODO: boolean,
  success: boolean,
  event: string,
  key: string,
  data: object,
}

export type DataGetInput = {
  event: string,
  args: {
    returnEvent: string,
    key: string,
  },
};

export type DataSaveInput = {
  event: string,
  args: {
    returnEvent: string,
    key: string,
    data: object,
  },
};
