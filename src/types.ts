export type SliceRecord<Slice> = Slice & Partial<Record<keyof Slice, unknown>>;

export type ReturnTuple<ValueType> = [
  ValueType,
  (value: ValueType | ((value: ValueType) => ValueType)) => void,
];

export type StoreSlice<Store, Slice> = Selector<Store, Slice> | SliceRecord<Slice>;

export type Handler<ValueType> = (
  value: ValueType,
  prev: ValueType
) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Selector<Store, Slice> = (store: Store) => SliceRecord<Slice>;
