import getSlice from './getSlice';
import {
  ReturnTuple, StoreSlice,
} from './types';

function useSilent<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): ReturnTuple<SLICE[KEY]>[0] {
  const slice = getSlice(storeSlice);

  return slice[key];
}

export default useSilent;
