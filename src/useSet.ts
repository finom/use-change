import { useCallback } from 'react';
import getSlice from './getSlice';
import {
  ReturnTuple, Selector, SliceRecord,
} from './types';

function useSet<Store, Key extends keyof Slice, Slice = Store>(
  storeSlice: Selector<Store, Slice> | SliceRecord<Slice>,
  key: Key,
): ReturnTuple<Slice[Key]>[1] {
  const slice = getSlice(storeSlice);

  return useCallback(
    (
      value: Slice[Key] | ((v: Slice[Key]) => Slice[Key]),
    ) => {
      if (typeof value === 'function') {
        const valueFunction = value as (
          v: Slice[Key]
        ) => Slice[Key];
        slice[key] = valueFunction(slice[key]);
      } else {
        slice[key] = value;
      }
    },
    [slice, key],
  );
}

export default useSet;
