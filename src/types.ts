export type SliceRecord<SLICE> = SLICE & Partial<Record<keyof SLICE, unknown>>;

export type Key<SLICE, KEY> = keyof SLICE & string & KEY;

export type ReturnTuple<SLICE, KEY extends keyof SLICE>
  = [SLICE[KEY], (value: SLICE[KEY] | ((value: SLICE[KEY]) => SLICE[KEY])) => void];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler<SLICE = any, KEY = any> = (value: SLICE[Key<SLICE, KEY>]) => any;

export interface Selector<STORE, SLICE> {
  (store: STORE): SliceRecord<SLICE>;
}
