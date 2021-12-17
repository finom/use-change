import { useCallback } from 'react';
import useStoreSlice from './useStoreSlice';
import {
  ReturnTuple, Selector, SliceRecord,
} from './types';

function useSet<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: KEY,
): ReturnTuple<SLICE[KEY]>[1] {
  const slice = useStoreSlice(storeSlice);

  type ValueFunction = (v: SLICE[KEY]) => SLICE[KEY];

  return useCallback(
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
}

export default useSet;
