import changeMap from './changeMap';
import { Handler, Key } from './types';

export default function unlistenChange<SLICE>(
  object: SLICE,
  key: Key<SLICE>,
  handler: Handler,
): void {
  const all: Record<Key<SLICE>, Handler[]> | undefined = changeMap.get(object);

  if (!all) return;
  const handlers: Handler[] = all[key];

  if (!handlers) return;

  all[key] = handlers.filter((h) => h !== handler);
}
