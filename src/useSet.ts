import { useCallback } from 'react';
import getSlice from './getSlice';
import {
  ReturnTuple, Selector, SliceRecord, Key,
} from './types';

function useSet<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE, typeof key>[1];

function useSet<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE, typeof key>[1];

function useSet<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): unknown {
  const slice = getSlice(storeSlice);

  return useCallback(
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

export default useSet;
