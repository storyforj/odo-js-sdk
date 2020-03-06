export interface ICallback {
	(data?: object) : void;
}

export interface IListenerCallback {
	(data: string) : void;
}

export interface Global {
  document: {
    addEventListener: (event: string, callback: IListenerCallback) => void,
    removeEventListener: (event: string, callback: IListenerCallback) => void,
  };
  navigator: { userAgent: string },
}

export class ODOStorage {
  public isStarted: boolean = false;
};
