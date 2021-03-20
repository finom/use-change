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

  return slice[key];
}

export default useSet;
