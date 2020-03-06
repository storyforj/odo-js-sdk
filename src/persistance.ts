import { EventEmitter } from 'events';
import { DataSaveInput, DataGetInput } from './types';

export default class Persistance {
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.eventEmitter.addListener('message', this.handleMessages);
  }

  get(data: DataGetInput) {
    const value = window.localStorage.getItem(data.args.key);
    this.eventEmitter.emit('message', {
      detail: JSON.stringify({
        isODO: true,
        success: true,
        event: data.args.returnEvent,
        key: data.args.key,
        data: value,
      })
    });
  }

  save(data: DataSaveInput) {
    const value = window.localStorage.setItem(data.args.key, JSON.stringify(data.args.data));
    this.eventEmitter.emit('message', {
      detail: JSON.stringify({
        isODO: true,
        success: true,
        event: data.args.returnEvent,
        key: data.args.key,
        data: value,
      })
    });
  }
  getForPlayer(data: DataGetInput) {
    const value = window.localStorage.getItem(`player:${data.args.key}`);
    this.eventEmitter.emit('message', {
      detail: JSON.stringify({
        isODO: true,
        success: true,
        event: data.args.returnEvent,
        key: data.args.key,
        data: value,
      })
    });
  }
  saveForPlayer(data: DataSaveInput) {
    const value = window.localStorage.setItem(`player:${data.args.key}`, JSON.stringify(data.args.data));
    this.eventEmitter.emit('message', {
      detail: JSON.stringify({
        isODO: true,
        success: true,
        event: data.args.returnEvent,
        key: data.args.key,
        data: value,
      })
    });
  }

  handleMessages = (event: CustomEvent) => {
    const data: any = JSON.parse(event.detail);

    switch(data.event) {
      case 'odo:data:save':
        this.save(data as DataSaveInput);
        break;
      case 'odo:data:saveForPlayer':
        this.saveForPlayer(data as DataSaveInput);
        break;
      case 'odo:data:get':
        this.get(data as DataGetInput);
        break;
      case 'odo:data:getForPlayer':
        this.getForPlayer(data as DataGetInput);
        break;
    }
  }

  destroy() {
    this.eventEmitter.removeListener('message', this.handleMessages);
  }
}
