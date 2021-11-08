import { useCallback, useEffect, useState } from 'react';
import listenChange from './listenChange';
import getSlice from './getSlice';
import {
  Key, ReturnTuple, Selector, SliceRecord,
} from './types';

function useChange<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE, typeof key>;

function useChange<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE, typeof key>;

function useChange<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): unknown {
  const slice = getSlice(storeSlice);

  const [stateValue, setStateValue] = useState(slice[key]);

  const setValue = useCallback(
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

    return listenChange(slice, key, handler);
  }, [key, slice, stateValue]);

  return [stateValue, setValue];
}

export default useChange;
