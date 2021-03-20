import {
  Key, ReturnTuple, Selector, SliceRecord,
} from './types';
import useChange from './useChange';

function useValue<STORE, KEY = keyof STORE, SLICE = STORE>(
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[0];

function useValue<STORE, KEY, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[0];

function useValue<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE, KEY>,
): ReturnTuple<SLICE[typeof key]>[0];

function useValue<STORE, KEY, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>
  | Key<SLICE, KEY>
  | SliceRecord<SLICE>,
  givenKey?: Key<SLICE, KEY>,
): unknown {
  // "any" is a temporary solution because ovwerloads aren't compatible for some reason
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useChange<STORE, KEY, SLICE>(storeSlice as any, givenKey as any)[0];
}

export default useValue;
