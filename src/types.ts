export interface ICallback {
	(data?: object) : void;
}

export interface Global {
  document: {
    addEventListener: (event: string, callback: ICallback) => void,
    removeEventListener: (event: string, callback: ICallback) => void,
  };
  navigator: { userAgent: string },
}
