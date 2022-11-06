import { useCallback } from 'react';
import useStoreSlice from './useStoreSlice';
import type { ReturnTuple, StoreSlice } from './types';

function useGet<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): () => ReturnTuple<SLICE[KEY]>[0] {
  const slice = useStoreSlice(storeSlice);

  return useCallback(() => slice[key], [slice, key]);
}

export default useGet;
