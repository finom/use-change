import getSlice from './getSlice';
import {
  ReturnTuple, StoreSlice,
} from './types';

function useSilent<Store, Key extends keyof Slice, Slice = Store>(
  storeSlice: StoreSlice<Store, Slice>,
  key: Key,
): ReturnTuple<Slice[Key]>[0] {
  const slice = getSlice(storeSlice);

  return slice[key];
}

export default useSilent;
