import type { ReturnTuple, StoreSlice } from './types';
import useChange from './useChange';

function useValue<STORE, KEY extends null | undefined | keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): ReturnTuple<SLICE, KEY>[0] {
  return useChange<STORE, KEY, SLICE>(storeSlice, key)[0];
}

export default useValue;
