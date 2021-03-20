import { createElement, ReactNode } from 'react';
import { Provider } from '../src';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (value: unknown) => ({
  children,
}: { children: ReactNode }) => createElement(Provider, { value }, children);
