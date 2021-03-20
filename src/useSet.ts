import { useCallback } from 'react';
import parseArgs from './parseArgs';
import {
  ReturnTuple, Selector, SliceRecord, Key,
} from './types';

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
