export type SliceRecord<SLICE> = SLICE & Record<keyof SLICE, unknown>;

export type Key<SLICE, KEY> = keyof SLICE & string & KEY;

export type ReturnTuple<T> = [T, (value: T | ((value: T) => T)) => void];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler<SLICE = any, KEY = any> = (value: SLICE[Key<SLICE, KEY>]) => any;

export interface Selector<STORE, SLICE> {
  (store: STORE): SliceRecord<SLICE>;
}
