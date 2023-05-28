import { Context as ReactContext, createContext } from 'react';
import type { KnownAny } from './types';

// eslint-disable-next-line import/no-mutable-exports
export let Context: ReactContext<KnownAny> = createContext<KnownAny>?.({
  __ERROR__: new Error('The component is not wrapped by provider'),
});

export function defineContext<T>(ctx: ReactContext<T>): ReactContext<T> {
  Context = ctx;
  return Context as ReactContext<T>;
}
