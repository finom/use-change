import {
  Key, ReturnTuple, Selector, SliceRecord,
} from './types';
import useChange from './useChange';

function useValue<STORE, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE>
): ReturnTuple<SLICE, typeof key>[0];

function useValue<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE>
): ReturnTuple<SLICE, typeof key>[0];

function useValue<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: Key<SLICE>,
): unknown {
  // "any" is a temporary solution because ovwerloads aren't compatible for some reason
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  return useChange<STORE, SLICE>(storeSlice as any, key)[0];
}

export default useValue;
