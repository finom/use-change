/* eslint-disable max-len */
import { useCallback, useEffect, useState } from 'react';
import listenChange from './listenChange';
import useStoreSlice from './useStoreSlice';
import type { ReturnTuple, StoreSlice } from './types';

function useChange<
  STORE,
  KEY extends null | undefined | keyof SLICE,
  SLICE = STORE,
>(
  storeSlice: StoreSlice<STORE, SLICE>,
  keyAsIs: KEY,
): ReturnTuple<SLICE, KEY> {
  const slice = useStoreSlice(storeSlice);
  const key = keyAsIs as Exclude<KEY, null | undefined>;

  // slice[key] can be a function
  const [stateValue, setStateValue] = useState(() => slice[key]);

  // eslint-disable-next-line max-len
  type ValueFunction = (v: SLICE[Exclude<KEY, null | undefined>]) => SLICE[Exclude<KEY, null | undefined>];

  const setValue = useCallback(
    (value: SLICE[Exclude<KEY, null | undefined>] | ValueFunction) => {
      if (key === null || key === undefined) return;
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
    if (key === null || key === undefined) return;
    // eslint-disable-next-line consistent-return
    return listenChange(slice, key, handler);
  }, [key, slice, stateValue]);

  return [
    (key === null || key === undefined
      ? undefined
      : stateValue) as KEY extends null | undefined ? undefined : SLICE[Exclude<KEY, null | undefined>],
    setValue,
  ];
}

export default useChange;
