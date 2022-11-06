import useStoreSlice from './useStoreSlice';
import type { ReturnTuple, StoreSlice } from './types';

function useSilent<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): ReturnTuple<SLICE[KEY]>[0] {
  const slice = useStoreSlice(storeSlice);

  return slice[key];
}

export default useSilent;
