export type SliceRecord<SLICE> = SLICE & Partial<Record<keyof SLICE, unknown>>;

export type Key<SLICE> = keyof SLICE;

export type ReturnTuple<SLICE, KEY extends keyof SLICE> = [
  SLICE[KEY],
  (value: SLICE[KEY] | ((value: SLICE[KEY]) => SLICE[KEY])) => void,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler<SLICE = any> = (
  value: SLICE[Key<SLICE>],
  prev: SLICE[Key<SLICE>]
) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Selector<STORE, SLICE> = (store: STORE) => SliceRecord<SLICE>;
