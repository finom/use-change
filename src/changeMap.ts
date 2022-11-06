/* eslint-disable no-underscore-dangle */
import type { Handler, KnownAny } from './types';

// allow to use one global WeakMap to support multiple instances of use-change
// for example two different scripts that both use their own use-change instance
// and they share one object to listen to
const globalObject = typeof window !== 'undefined'
  ? (window as { __useChangeObjectMap?: WeakMap<KnownAny, Record<KnownAny, Handler<KnownAny>[]>> })
  : {};

const weakMap = globalObject.__useChangeObjectMap
  || new WeakMap<KnownAny, Record<KnownAny, Handler<KnownAny>[]>>();

globalObject.__useChangeObjectMap = weakMap;

export default weakMap;
