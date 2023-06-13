import listenChange from './listenChange';

/**
 * Experimental function to wait for a value to be set.
 * Usage:
 * await waitForValue(object, key, (value) => checkBoolean(value))
 */
export default function waitForValue<SLICE, KEY extends keyof SLICE>(
  givenObject: SLICE,
  key: KEY,
  predicate: (value: SLICE[KEY], key: KEY) => boolean,
): Promise<SLICE[KEY]> {
  return new Promise((resolve) => {
    const handler = () => {
      if (predicate(givenObject[key], key)) {
        resolve(givenObject[key]);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        unlisten();
      }
    };

    const unlisten = listenChange(givenObject, key, handler);

    handler();
  });
}
