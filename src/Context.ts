import { createContext } from 'react';

export default createContext({
  __ERROR__: new Error('The component is not wrapped by provider'),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
