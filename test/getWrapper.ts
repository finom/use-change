import { createElement, ReactNode } from 'react';
import { Provider } from '../src';

export default (value: unknown) => ({ 
    children 
}: { children: ReactNode }) => createElement(Provider, { value }, children);
