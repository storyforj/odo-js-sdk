import { EventEmitter } from 'events';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import * as ODO from '../src/odo';

chai.use(spies);
const { expect } = chai;

describe('odo', () => {
  it('registers and degregisters event listeners', async function() {
    const odo = ODO.init();
    const callback = chai.spy(() => {});

    odo.events.on(ODO.Events.start, callback);
    odo.events.emit(ODO.Events.start);
    expect(callback).to.have.been.called.exactly(1);

    odo.events.off(ODO.Events.start, callback);
    odo.events.emit(ODO.Events.start);
    expect(callback).to.have.been.called.exactly(1);
  });

  it('listens to an event just once', async function() {
    const odo = ODO.init();
    const callback = chai.spy(() => {});

    odo.events.once(ODO.Events.start, callback);
    odo.events.emit(ODO.Events.start);
    odo.events.emit(ODO.Events.start);
    expect(callback).to.have.been.called.exactly(1);
  });

  it('fires the start event even if the listener is added out of sequence', async function() {
    const odo = ODO.init();
    const callback = chai.spy(() => {});

    odo.events.emit(ODO.Events.start);
    odo.events.on(ODO.Events.start, callback);
    expect(callback).to.have.been.called.exactly(1);
  });

  it('fires the start event after the "ready" trigger fires', async function() {
    const odo = ODO.init();
    const callback = chai.spy(() => {});

    odo.events.on(ODO.Events.start, callback);
    odo.trigger(ODO.Triggers.ready);
    expect(callback).to.have.been.called.exactly(1);
  });

  it('saves data and responds to successful messages', async function() {
    const fakeGlobalEventListener: EventEmitter = new EventEmitter();
    const theGlobal = {
      navigator: { userAgent: 'n/a' },
      document: {
        addEventListener: fakeGlobalEventListener.on.bind(fakeGlobalEventListener),
        removeEventListener: fakeGlobalEventListener.off.bind(fakeGlobalEventListener),
      },
      postMessage: chai.spy((message: { event: 'string', args: { returnEvent: string, key: string, data: object } }) => {
        fakeGlobalEventListener.emit('message', JSON.stringify({
          isODO: true,
          success: true,
          event: message.args.returnEvent,
          key: message.args.key,
          data: message.args.data,
        }));
      }),
    };
    const odo = ODO.init(theGlobal);
    const testData = { testing: '123' };
    const result: any = await odo.data.save('testing', testData);
    expect(theGlobal.postMessage).to.have.been.called.exactly(1);
    expect(result.key).to.be.equal('testing');
    expect(result.data).to.be.deep.equal(testData);
  });

  it('gets data and responds to successful messages', async function() {
    const testData = { testing: '123' };

    const fakeGlobalEventListener: EventEmitter = new EventEmitter();
    const theGlobal = {
      navigator: { userAgent: 'n/a' },
      document: {
        addEventListener: fakeGlobalEventListener.on.bind(fakeGlobalEventListener),
        removeEventListener: fakeGlobalEventListener.off.bind(fakeGlobalEventListener),
      },
      postMessage: chai.spy((message: { event: 'string', args: { returnEvent: string, key: string, data: object } }) => {
        fakeGlobalEventListener.emit('message', JSON.stringify({
          isODO: true,
          success: true,
          event: message.args.returnEvent,
          key: message.args.key,
          data: testData,
        }));
      }),
    };
    const odo = ODO.init(theGlobal);

    const result: any = await odo.data.get('testing');
    expect(theGlobal.postMessage).to.have.been.called.exactly(1);
    expect(result.key).to.be.equal('testing');
    expect(result.data).to.be.deep.equal(testData);
  });

  it('fails when get returns an unsuccessful reponse', async function() {
    const fakeGlobalEventListener: EventEmitter = new EventEmitter();
    const theGlobal = {
      navigator: { userAgent: 'n/a' },
      document: {
        addEventListener: fakeGlobalEventListener.on.bind(fakeGlobalEventListener),
        removeEventListener: fakeGlobalEventListener.off.bind(fakeGlobalEventListener),
      },
      postMessage: chai.spy((message: { event: 'string', args: { returnEvent: string, key: string, data: object } }) => {
        fakeGlobalEventListener.emit('message', JSON.stringify({
          isODO: true,
          success: false,
          event: message.args.returnEvent,
          key: message.args.key,
        }));
      }),
    };
    const odo = ODO.init(theGlobal);

    let result: { success?: Boolean, key?: string } = {};
    try {
      result = await odo.data.get('testing');
    } catch (err) {
      result = err;
    }
    expect(theGlobal.postMessage).to.have.been.called.exactly(1);
    expect(result.key).to.be.equal('testing');
  });

  it('executes an analytics tracking event', async function() {
    const fakeGlobalEventListener: EventEmitter = new EventEmitter();
    const theGlobal = {
      navigator: { userAgent: 'n/a' },
      document: {
        addEventListener: fakeGlobalEventListener.on.bind(fakeGlobalEventListener),
        removeEventListener: fakeGlobalEventListener.off.bind(fakeGlobalEventListener),
      },
      postMessage: chai.spy(() => {}),
    };

    const odo = ODO.init(theGlobal);
    const testData = { testing: '123' };
    odo.track('testing', testData);
    expect(theGlobal.postMessage).to.have.been.called.exactly(1);
  });
});
