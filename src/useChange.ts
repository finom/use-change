import { useCallback, useEffect, useState } from 'react';
import listenChange from './listenChange';
import useStoreSlice from './useStoreSlice';
import {
  ReturnTuple, StoreSlice,
} from './types';

function useChange<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): ReturnTuple<SLICE[KEY]> {
  const slice = useStoreSlice(storeSlice);

  const [stateValue, setStateValue] = useState(slice[key]);

  const setValue = useCallback(
    (
      value: SLICE[typeof key] | ((v: SLICE[typeof key]) => SLICE[typeof key]),
    ) => {
      if (typeof value === 'function') {
        const valueFunction = value as (
          v: SLICE[typeof key]
        ) => SLICE[typeof key];
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
