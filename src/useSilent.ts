import getSlice from './getSlice';
import {
  ReturnTuple, Selector, SliceRecord, Key,
} from './types';

function useSilent<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE, typeof key>[0];

function useSilent<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE, typeof key>[0];

function useSilent<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): unknown {
  const slice = getSlice(storeSlice);

  return slice[key];
}

export default useSilent;
