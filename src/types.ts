/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KnownAny = any;

export type SliceRecord<SLICE> = SLICE & Partial<Record<keyof SLICE, unknown>>;

/*
export type ReturnTuple<VALUE, KEY> = [
  VALUE | (KEY extends null | undefined ? undefined : never),
  (value: VALUE | ((value: VALUE) => VALUE)) => void,
];
*/
export type ReturnTuple<SLICE, KEY extends null | undefined | keyof SLICE> = [
  KEY extends null | undefined ? undefined : SLICE[Exclude<KEY, null | undefined>],
  (value: SLICE[Exclude<KEY, null | undefined>] | ((value: SLICE[Exclude<KEY, null | undefined>]) => SLICE[Exclude<KEY, null | undefined>])) => void,
];

export type StoreSlice<STORE, SLICE> = Selector<STORE, SLICE> | SliceRecord<SLICE>;

export type Handler<VALUE> = (
  value: VALUE,
  prev: VALUE
) => KnownAny;

export type Selector<STORE, SLICE> = (store: STORE) => SliceRecord<SLICE>;
