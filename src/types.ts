// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KnownAny = any;

export type SliceRecord<SLICE> = SLICE & Partial<Record<keyof SLICE, unknown>>;

export type ReturnTuple<VALUE> = [
  VALUE,
  (value: VALUE | ((value: VALUE) => VALUE)) => void,
];

export type StoreSlice<STORE, SLICE> = Selector<STORE, SLICE> | SliceRecord<SLICE>;

export type Handler<VALUE> = (
  value: VALUE,
  prev: VALUE
) => KnownAny;

export type Selector<STORE, SLICE> = (store: STORE) => SliceRecord<SLICE>;
