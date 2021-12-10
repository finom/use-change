import changeMap from './changeMap';
import { Handler } from './types';

export default function unlistenChange<Slice, Key extends keyof Slice>(
  object: Slice,
  key: Key,
  handler: Handler<Slice[Key]>,
): void {
  const all: Record<Key, Handler<Slice[Key]>[]> | undefined = changeMap.get(object);

  if (!all) return;
  const handlers: Handler<Slice[Key]>[] = all[key];

  if (!handlers) return;

  all[key] = handlers.filter((h) => h !== handler);
}
