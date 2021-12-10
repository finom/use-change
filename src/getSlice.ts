import { useContext, Context } from 'react';
import UseChangeContext from './Context';
import { SliceRecord, StoreSlice } from './types';

export default function getSlice<Store, Slice = Store>(
  storeSlice: StoreSlice<Store, Slice>,
): Slice {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useContext(UseChangeContext as Context<Store>);
  let slice: SliceRecord<Slice>;

  if (typeof storeSlice === 'object') {
    slice = storeSlice;
  } else if (typeof storeSlice === 'function') {
    slice = storeSlice(store);
  } else {
    throw new Error('Unknown store slice');
  }

  return slice;
}
