import { useContext } from 'react';
import Context from './Context';
import { Selector, SliceRecord } from './types';

export default function getSlice<STORE, SLICE = STORE>(
  storeSlice: Selector<STORE, SLICE> | SliceRecord<SLICE>,
): SLICE {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useContext<STORE>(Context);
  let slice: SliceRecord<SLICE>;

  if (typeof storeSlice === 'object') {
    slice = storeSlice;
  } else if (typeof storeSlice === 'function') {
    slice = storeSlice(store);
  } else {
    throw new Error('Unknown store slice');
  }

  return slice;
}
