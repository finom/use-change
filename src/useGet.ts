import { useCallback } from 'react';
import useStoreSlice from './useStoreSlice';
import type { StoreSlice } from './types';

function useGet<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
) {
  const slice = useStoreSlice(storeSlice);

  return useCallback(() => slice[key], [slice, key]);
}

export default useGet;
