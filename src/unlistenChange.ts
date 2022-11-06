import changeMap from './changeMap';
import type { Handler } from './types';

export default function unlistenChange<SLICE, KEY extends keyof SLICE>(
  object: SLICE,
  key: KEY,
  handler: Handler<SLICE[KEY]>,
): void {
  const all: Record<KEY, Handler<SLICE[KEY]>[]> | undefined = changeMap.get(object);

  if (!all) return;
  const handlers: Handler<SLICE[KEY]>[] = all[key];

  if (!handlers) return;

  all[key] = handlers.filter((h) => h !== handler);
}
