import changeMap from './changeMap';
import { Handler, Key } from './types';

export default function listenChange<SLICE, KEY>(
  givenObject: SLICE, key: Key<SLICE, KEY>, handler: Handler<SLICE, KEY>,
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
          object[sym] = v;

          all[key]?.forEach((h) => { h(v); });
        }
      },
    });
  }

  changeMap.set(givenObject, all);

  const handlers = all[key] || [];

  all[key] = handlers;

  if (!handlers.includes(handler)) {
    handlers.push(handler);
  }

  return () => {
    all[key] = handlers.filter((h) => h !== handler);
  };
}
