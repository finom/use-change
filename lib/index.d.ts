/// <reference types="react" />
export declare const Context: import("react").Context<any>;
export declare const Provider: import("react").Provider<any>;
declare type SliceRecord<SLICE> = SLICE & Record<keyof SLICE, unknown>;
declare type Key<SLICE, KEY> = keyof SLICE & string & KEY;
declare type ReturnTuple<T> = [T, (value: T | ((value: T) => T)) => void];
declare type Handler<SLICE = any, KEY = any> = (value: SLICE[Key<SLICE, KEY>]) => void;
declare function listenChange<SLICE, KEY>(givenObject: SLICE, key: Key<SLICE, KEY>, handler: Handler<SLICE, KEY>): () => void;
declare function unlistenChange<SLICE, KEY>(object: SLICE, key: Key<SLICE, KEY>, handler: Handler): void;
interface Selector<STORE, SLICE> {
    (store: STORE): SliceRecord<SLICE>;
}
declare function useChange<STORE, KEY = keyof STORE, SLICE = STORE>(key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>;
declare function useChange<STORE, KEY, SLICE = STORE>(storeSlice: SliceRecord<SLICE>, key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>;
declare function useChange<STORE, KEY, SLICE = STORE>(storeSlice: Selector<STORE, SLICE>, key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>;
declare function useValue<STORE, KEY = keyof STORE, SLICE = STORE>(key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>[0];
declare function useValue<STORE, KEY, SLICE = STORE>(storeSlice: SliceRecord<SLICE>, key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>[0];
declare function useValue<STORE, KEY, SLICE = STORE>(storeSlice: Selector<STORE, SLICE>, key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>[0];
declare function useSet<STORE, KEY = keyof STORE, SLICE = STORE>(key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>[1];
declare function useSet<STORE, KEY, SLICE = STORE>(storeSlice: SliceRecord<SLICE>, key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>[1];
declare function useSet<STORE, KEY, SLICE = STORE>(storeSlice: Selector<STORE, SLICE>, key: Key<SLICE, KEY>): ReturnTuple<SLICE[typeof key]>[1];
export default useChange;
export { useValue, useSet, listenChange, unlistenChange, };
