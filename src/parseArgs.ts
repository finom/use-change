import { useContext } from 'react';
import Context from './Context';
import { Key, Selector, SliceRecord } from './types';

export default function parseArgs<STORE, KEY = keyof STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE>
  | Key<SLICE, KEY>
  | SliceRecord<SLICE>,
  givenKey?: Key<SLICE, KEY>,
): { slice: SLICE, key: Key<SLICE, KEY> } {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useContext<STORE>(Context);
  let slice: SliceRecord<SLICE>;
  let key: Key<SLICE, KEY>;

  if (!givenKey) {
    slice = store as unknown as SliceRecord<SLICE>;
    key = storeSlice as Key<SLICE, KEY>;
  } else if (typeof storeSlice === 'object') {
    slice = storeSlice as SliceRecord<SLICE>;
    key = givenKey;
  } else if (typeof storeSlice === 'function') {
    slice = (storeSlice as Selector<STORE, SLICE>)(store);
    key = givenKey;
  } else {
    throw new Error('Unknown store slice');
  }

  return { slice, key };
}
