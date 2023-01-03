import { useCallback, useEffect, useState } from 'react';
import listenChange from './listenChange';
import useStoreSlice from './useStoreSlice';
import type { ReturnTuple, StoreSlice } from './types';

function useChange<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): ReturnTuple<SLICE[KEY]> {
  const slice = useStoreSlice(storeSlice);

  // slice[key] can be a function
  const [stateValue, setStateValue] = useState(() => slice[key]);

  type ValueFunction = (v: SLICE[KEY]) => SLICE[KEY];

  const setValue = useCallback(
    (value: SLICE[KEY] | ValueFunction) => {
      if (typeof value === 'function') {
        const valueFunction = value as ValueFunction;
        slice[key] = valueFunction(slice[key]);
      } else {
        slice[key] = value;
      }
    },
    [slice, key],
  );

  useEffect(() => {
    const handler = () => {
      // slice[key] can be a function
      setStateValue(() => slice[key]);
    };

    if (slice[key] !== stateValue) {
      handler();
    }

    return listenChange(slice, key, handler);
  }, [key, slice, stateValue]);

  return [stateValue, setValue];
}

export default useChange;
