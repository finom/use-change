import getSlice from './getSlice';
import {
  ReturnTuple, Selector, SliceRecord, Key,
} from './types';

function useSilent<STORE, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE>
): ReturnTuple<SLICE, typeof key>[0];

function useSilent<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE>
): ReturnTuple<SLICE, typeof key>[0];

function useSilent<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: Key<SLICE>,
): unknown {
  const slice = getSlice(storeSlice);

  return slice[key];
}

export default useSilent;
