import changeMap from './changeMap';
import { Handler, Key } from './types';

export default function listenChange<SLICE>(
  givenObject: SLICE,
  key: Key<SLICE>,
  handler: Handler<SLICE>,
): () => void {
  const all: Record<Key<SLICE>, Handler[]> = changeMap.get(givenObject) ?? {};

  if (!Object.getOwnPropertyDescriptor(givenObject, key)?.get) {
    const object = givenObject as unknown as {
      [key in Key<SLICE>]: unknown;
    };

    let value = object[key];

    Object.defineProperty(object, key, {
      configurable: false,
      get: () => value,
      set: (v: unknown) => {
        if (object[key] !== v) {
          const prev = object[key];
          value = v;

          all[key]?.forEach((h) => {
            h(v, prev);
          });
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
