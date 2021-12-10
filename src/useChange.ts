import { useCallback, useEffect, useState } from 'react';
import listenChange from './listenChange';
import getSlice from './getSlice';
import {
  ReturnTuple, StoreSlice,
} from './types';

function useChange<Store, Key extends keyof Slice, Slice = Store>(
  storeSlice: StoreSlice<Store, Slice>,
  key: Key,
): ReturnTuple<Slice[Key]> {
  const slice = getSlice(storeSlice);

  const [stateValue, setStateValue] = useState(slice[key]);

  const setValue = useCallback(
    (
      value: Slice[typeof key] | ((v: Slice[typeof key]) => Slice[typeof key]),
    ) => {
      if (typeof value === 'function') {
        const valueFunction = value as (
          v: Slice[typeof key]
        ) => Slice[typeof key];
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
