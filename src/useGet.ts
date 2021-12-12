import { useCallback } from 'react';
import getSlice from './getSlice';
import {
  ReturnTuple, StoreSlice,
} from './types';

function useGet<STORE, KEY extends keyof SLICE, SLICE = STORE>(
  storeSlice: StoreSlice<STORE, SLICE>,
  key: KEY,
): () => ReturnTuple<SLICE[KEY]>[0] {
  const slice = getSlice(storeSlice);

  return useCallback(() => slice[key], [slice, key]);
}

export default useGet;
