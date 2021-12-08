/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import { Handler } from './types';

// allow to use one global WeakMap to support multiple instances of use-change
// for example two different scripts that both use their own use-change instance
// and they share one object to listen to
const globalObject = typeof window !== 'undefined' ? window as { __useChangeObjectMap?: WeakMap<any, Record<any, Handler[]>> } : {};

const weakMap = globalObject.__useChangeObjectMap || new WeakMap<any, Record<any, Handler[]>>();

globalObject.__useChangeObjectMap = weakMap;

export default weakMap;
