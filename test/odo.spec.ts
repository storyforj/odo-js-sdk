import * as chai from 'chai';
import * as spies from 'chai-spies';

import * as ODO from '../src/odo';

chai.use(spies);
const { expect } = chai;

describe('odo', () => {
  it('registers and degregisters event listeners', async function() {
    const odo = ODO.init();
    const callback = chai.spy(() => {});

    odo.on(ODO.Events.start, callback);
    odo.__triggerForTesting(ODO.Events.start);
    expect(callback).to.have.been.called.exactly(1);

    odo.off(ODO.Events.start, callback);
    odo.__triggerForTesting(ODO.Events.start);
    expect(callback).to.have.been.called.exactly(1);
  });

  it('listens to an event just once', async function() {
    const odo = ODO.init();
    const callback = chai.spy(() => {});

    odo.once(ODO.Events.start, callback);
    odo.__triggerForTesting(ODO.Events.start);
    odo.__triggerForTesting(ODO.Events.start);
    expect(callback).to.have.been.called.exactly(1);
  });
});
