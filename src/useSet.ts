import { useCallback } from 'react';
import getSlice from './getSlice';
import {
  ReturnTuple, Selector, SliceRecord,
} from './types';

function useSet<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: KEY,
): ReturnTuple<SLICE[KEY]>[1] {
  const slice = getSlice(storeSlice);

  return useCallback(
    (
      value: SLICE[KEY] | ((v: SLICE[KEY]) => SLICE[KEY]),
    ) => {
      if (typeof value === 'function') {
        const valueFunction = value as (
          v: SLICE[KEY]
        ) => SLICE[KEY];
        slice[key] = valueFunction(slice[key]);
      } else {
        slice[key] = value;
      }
    },
    [slice, key],
  );
}

export default useSet;
