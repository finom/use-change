import {
  ReturnTuple, StoreSlice,
} from './types';
import useChange from './useChange';

function useValue<Store, Key extends keyof Slice, Slice = Store>(
  storeSlice: StoreSlice<Store, Slice>,
  key: Key,
): ReturnTuple<Slice[Key]>[0] {
  return useChange<Store, Key, Slice>(storeSlice, key)[0];
}

export default useValue;
