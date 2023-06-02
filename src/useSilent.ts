import useStoreSlice from './useStoreSlice';
import type { StoreSlice } from './types';

function useSilent<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
) {
  const slice = useStoreSlice(storeSlice);

  return slice[key];
}

export default useSilent;
