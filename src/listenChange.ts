import changeMap from './changeMap';
import { Handler, Key } from './types';

export default function listenChange<SLICE, KEY>(
  givenObject: SLICE,
  key: Key<SLICE, KEY>,
  handler: Handler<SLICE, KEY>,
): () => void {
  const all: Record<string, Handler[]> = changeMap.get(givenObject) ?? {};

  if (!Object.getOwnPropertyDescriptor(givenObject, key)?.get) {
    const sym = Symbol.for(key);
    const object = givenObject as unknown as { [key in string | number | typeof sym]: unknown; };

    object[sym] = object[key];

    Object.defineProperty(object, key, {
      configurable: false,
      get: () => object[sym],
      set: (v: unknown) => {
        if (object[sym] !== v) {
          const prev = object[sym];
          object[sym] = v;

          all[key]?.forEach((h) => { h(v, prev); });
        }
      },
    });
  }

  changeMap.set(givenObject, all);

  const handlers = all[key] || [];

  if (!handlers.includes(handler)) {
    handlers.push(handler);
  }

  all[key] = handlers;

  return () => {
    all[key] = all[key].filter((h) => h !== handler);
  };
}
