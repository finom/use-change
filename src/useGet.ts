import { useCallback } from 'react';
import getSlice from './getSlice';
import {
  ReturnTuple, StoreSlice,
} from './types';

function useGet<Store, Key extends keyof Slice, Slice = Store>(
  storeSlice: StoreSlice<Store, Slice>,
  key: Key,
): () => ReturnTuple<Slice[Key]>[0] {
  const slice = getSlice(storeSlice);

  return useCallback(() => slice[key], [slice, key]);
}

export default useGet;
