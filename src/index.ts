/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect, useState, useCallback, useContext, createContext,
} from 'react';

export const Context = createContext({
  __ERROR__: new Error('The component is not wrapped by provider'),
} as any);
export const { Provider } = Context;

  type SliceRecord<SLICE> = SLICE & Record<keyof SLICE, unknown>;

  type Key<SLICE, KEY> = keyof SLICE & string & KEY;

  type ReturnTuple<T> = [T, (value: T | ((value: T) => T)) => void];

  type Handler<SLICE = any, KEY = any> = (value: SLICE[Key<SLICE, KEY>]) => void;

const changeMap = new WeakMap<any, Record<string, Handler[]>>();

function listenChange<SLICE, KEY>(
  givenObject: SLICE, key: Key<SLICE, KEY>, handler: Handler<SLICE, KEY>,
): () => void {
  const all: Record<string, Handler[]> = changeMap.get(givenObject) ?? {};

  if (!Object.getOwnPropertyDescriptor(givenObject, key)?.get) {
    const sym = Symbol.for(key);
    const object = givenObject as unknown as { [key in string | number | typeof sym]: any; };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    object[sym] = object[key];

    Object.defineProperty(object, key, {
      configurable: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      get: () => object[sym],
      set: (v: any) => {
        if (object[sym] !== v) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          object[sym] = v;

          all[key]?.forEach((h) => { h(v); });
        }
      },
    });
  }

  changeMap.set(givenObject, all);

  const handlers = all[key] || [];

  all[key] = handlers;

  if (!handlers.includes(handler)) {
    handlers.push(handler);
  }

  return () => {
    all[key] = handlers.filter((h) => h !== handler);
  };
}

function unlistenChange<SLICE, KEY>(
  object: SLICE, key: Key<SLICE, KEY>, handler: Handler,
): void {
  const all: Record<string, Handler[]> | undefined = changeMap.get(object);

  if (!all) return;
  const handlers: Handler[] = all[key];

  if (!handlers) return;

  all[key] = handlers.filter((h) => h !== handler);
}

const parseArgs = <STORE, KEY = keyof STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>
  | Key<SLICE, KEY>
  | SliceRecord<SLICE>,
  givenKey?: Key<SLICE, KEY>,
) => {
  const store = useContext<STORE>(Context);
  let slice: SliceRecord<SLICE>;
  let key: Key<SLICE, KEY>;

  if (!givenKey) {
    slice = store as unknown as SliceRecord<SLICE>;
    // eslint-disable-next-line no-param-reassign
    key = storeSlice as Key<SLICE, KEY>;
  } else if (typeof storeSlice === 'object') {
    slice = storeSlice as SliceRecord<SLICE>;
    key = givenKey;
  } else if (typeof storeSlice === 'function') {
    slice = (storeSlice as Selector<STORE, SLICE>)(store);
    key = givenKey;
  } else {
    throw new Error('Unknown store slice');
  }

  return { slice, key };
};

interface Selector<STORE, SLICE> {
  (store: STORE): SliceRecord<SLICE>;
}

// see https://stackoverflow.com/questions/60377365/typescript-infer-type-of-generic-after-optional-first-generic
function useChange<STORE, KEY = keyof STORE, SLICE = STORE>(
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>;

function useChange<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>;

function useChange<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>;

function useChange<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>
  | Key<SLICE, KEY>
  | SliceRecord<SLICE>,
  givenKey?: Key<SLICE, KEY>,
): unknown {
  const { slice, key } = parseArgs(storeSlice, givenKey);

  const [stateValue, setStateValue] = useState(slice[key]);

  const setValue = useCallback(
    // eslint-disable-next-line no-param-reassign
    (value: SLICE[typeof key] | ((v: SLICE[typeof key]) => SLICE[typeof key])) => {
      if (typeof value === 'function') {
        const valueFunction = value as (v: SLICE[typeof key]) => SLICE[typeof key];
        slice[key] = valueFunction(slice[key]);
      } else {
        slice[key] = value;
      }
    },
    [slice, key],
  );

  useEffect(() => {
    const handler = () => {
      setStateValue(slice[key]);
    };

    if (slice[key] !== stateValue) {
      handler();
    }

    const unlisten = listenChange(slice, key, handler);

    return () => { unlisten(); };
  }, [key, slice, stateValue]);

  return [stateValue, setValue];
}

function useValue<STORE, KEY = keyof STORE, SLICE = STORE>(
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[0];

function useValue<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[0];

function useValue<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[0];

function useValue<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>
  | Key<SLICE, KEY>
  | SliceRecord<SLICE>,
  givenKey?: Key<SLICE, KEY>,
): unknown {
  // "any" is a temporary solution because ovwerloads aren't compatible for some reason
  return useChange<STORE, KEY, SLICE>(storeSlice as any, givenKey as any)[0];
}

function useSet<STORE, KEY = keyof STORE, SLICE = STORE>(
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[1];

function useSet<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[1];

function useSet<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[1];

function useSet<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>
  | Key<SLICE, KEY>
  | SliceRecord<SLICE>,
  givenKey?: Key<SLICE, KEY>,
): unknown {
  const { slice, key } = parseArgs(storeSlice, givenKey);

  return useCallback(
    // eslint-disable-next-line no-param-reassign
    (value: SLICE[typeof key] | ((v: SLICE[typeof key]) => SLICE[typeof key])) => {
      if (typeof value === 'function') {
        const valueFunction = value as (v: SLICE[typeof key]) => SLICE[typeof key];
        slice[key] = valueFunction(slice[key]);
      } else {
        slice[key] = value;
      }
    },
    [slice, key],
  );
}

export default useChange;

export {
  useValue, useSet, listenChange, unlistenChange,
};
