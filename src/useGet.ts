import { useCallback } from 'react';
import getSlice from './getSlice';
import {
  ReturnTuple, Selector, SliceRecord, Key,
} from './types';

function useGet<STORE, SLICE = STORE>(
  storeSlice: SliceRecord<SLICE>,
  key: Key<SLICE>
): () => ReturnTuple<SLICE, typeof key>[0];

function useGet<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>,
  key: Key<SLICE>
): () => ReturnTuple<SLICE, typeof key>[0];

function useGet<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
  key: Key<SLICE>,
): unknown {
  const slice = getSlice(storeSlice);

  return useCallback(() => slice[key], [slice, key]);
}

export default useGet;
