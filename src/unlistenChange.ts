import changeMap from './changeMap';
import { Handler, Key } from './types';

export default function unlistenChange<SLICE, KEY>(
  object: SLICE, key: Key<SLICE, KEY>, handler: Handler,
): void {
  const all: Record<string, Handler[]> | undefined = changeMap.get(object);

  if (!all) return;
  const handlers: Handler[] = all[key];

  if (!handlers) return;

  all[key] = handlers.filter((h) => h !== handler);
}
