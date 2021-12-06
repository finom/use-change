import { createElement, ReactNode } from 'react';
import { Provider } from '../src';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (value: unknown) => function wrapper({
  children,
}: { children: ReactNode }) {
  return createElement(Provider, { value }, children);
};
