import React, { createContext } from 'react';

// eslint-disable-next-line import/no-mutable-exports
export let Context = createContext<unknown>({});

export function defineContext<T>(ctx: T) {
  Context = ctx as React.Context<unknown>;
  return Context;
}
