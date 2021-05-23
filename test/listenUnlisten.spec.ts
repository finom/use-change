import { listenChange, unlistenChange } from '../src';

describe('listen & unlisten', () => {
  it('listenChange and returned unlisten', () => {
    const store = { x: 1 };
    let prev: number;
    let triggerTimes = 0;

    const unlisten = listenChange(store, 'x', (x: number, previous) => {
      triggerTimes += 1;
      expect(x).toBe(store.x);
      expect(prev).toBe(previous);
    });

    prev = store.x;
    store.x = 2;
    expect(triggerTimes).toBe(1);
    prev = store.x;
    store.x = 3;
    expect(triggerTimes).toBe(2);
    unlisten();
    prev = store.x;
    store.x = 4;
    expect(triggerTimes).toBe(2);
    prev = store.x;
    store.x = 5;
    expect(triggerTimes).toBe(2);
  });

  it('listenChange and unlistenChange', () => {
    const store = { x: 1 };
    let triggerTimes = 0;

    const handler = (x: number) => {
      triggerTimes += 1;
      expect(x).toBe(store.x);
    };

    listenChange(store, 'x', handler);
    store.x = 2;
    expect(triggerTimes).toBe(1);
    store.x = 3;
    expect(triggerTimes).toBe(2);
    // pass different callback
    unlistenChange(store, 'x', () => {});
    store.x = 4;
    expect(triggerTimes).toBe(3);
    store.x = 5;
    expect(triggerTimes).toBe(4);
    unlistenChange(store, 'x', handler);
    store.x = 6;
    expect(triggerTimes).toBe(4);
    store.x = 7;
    expect(triggerTimes).toBe(4);
  });
});
