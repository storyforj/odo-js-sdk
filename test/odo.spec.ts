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
});
