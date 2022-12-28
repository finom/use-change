import useChange from './useChange';
import useValue from './useValue';
import useGet from './useGet';
import useSet from './useSet';
import useSilent from './useSilent';
import listenChange from './listenChange';
import unlistenChange from './unlistenChange';
import { Context, defineContext as UNSAFE_defineContext } from './Context';
import useStoreSlice from './useStoreSlice';
import type {
  SliceRecord, ReturnTuple, StoreSlice, Handler, Selector,
} from './types';

const { Provider } = Context;

export default useChange;

export {
  useValue,
  useGet,
  useSet,
  useSilent,
  listenChange,
  unlistenChange,
  Context,
  Provider,
  UNSAFE_defineContext,
  useStoreSlice,
};

export type {
  SliceRecord, ReturnTuple, StoreSlice, Handler, Selector,
};
