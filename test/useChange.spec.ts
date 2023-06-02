import { renderHook, act } from '@testing-library/react-hooks';
import useChange from '../src';
import getWrapper from './getWrapper';

const VALUE = 0;
const SET = 1;

describe('useChange', () => {
  it('Explicit overload', () => {
    const store: { x: number | (() => void), foo?: unknown } = { x: 1 };
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(store, 'x');
    });

    expect(result.current[VALUE]).toBe(1);
    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(2);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(2);

    act(() => { store.x = 3; });

    expect(result.current[VALUE]).toBe(3);
    expect(store.x).toBe(3);
    expect(renderedTimes).toBe(3);

    const f = () => {};
    act(() => { store.x = f; });

    expect(result.current[VALUE]).toBe(f);
    expect(store.x).toBe(f);
    expect(renderedTimes).toBe(4);
  });

  it('Implicit overload', () => {
    const store: { x: { y: number | (() => void) }, foo?: unknown } = { x: { y: 1 } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      const y = useChange(({ x }: typeof store) => x, 'y');
      // const [Y] = y;
      // const [nullishY] = useChange(({ x }: typeof store) => x, 'y' as null | 'y');

      return y;
    }, { wrapper });

    expect(result.current[VALUE]).toBe(1);
    expect(renderedTimes).toBe(1);
    expect(store.x.y).toBe(1);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x.y).toBe(2);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x.y).toBe(2);

    act(() => { store.x.y = 3; });

    expect(result.current[VALUE]).toBe(3);
    expect(store.x.y).toBe(3);
    expect(renderedTimes).toBe(3);

    const f = () => {};

    act(() => { store.x.y = f; });

    expect(result.current[VALUE]).toBe(f);
    expect(store.x.y).toBe(f);
    expect(renderedTimes).toBe(4);
  });

  it('Implicit overload & nested store', () => {
    const store: { x: { y: { z: number } }, foo?: unknown } = { x: { y: { z: 1 } } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(({ x }: typeof store) => x.y, 'z');
    }, { wrapper });

    expect(result.current[VALUE]).toBe(1);
    expect(renderedTimes).toBe(1);
    expect(store.x.y.z).toBe(1);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x.y.z).toBe(2);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x.y.z).toBe(2);

    act(() => { store.x.y.z = 3; });

    expect(result.current[VALUE]).toBe(3);
    expect(store.x.y.z).toBe(3);
    expect(renderedTimes).toBe(3);
  });

  it('Supports numbers as keys', () => {
    const store: { 0: number } = { 0: 1 };
    const wrapper = getWrapper(store);

    let renderedTimes = 0;

    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(store, 0);
    }, { wrapper });

    expect(result.current[VALUE]).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
  });

  it('Supports symbols as keys', () => {
    const symbol = Symbol('foo');
    const store: { [symbol]: number } = { [symbol]: 1 };
    const wrapper = getWrapper(store);

    let renderedTimes = 0;

    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(store, symbol);
    }, { wrapper });

    expect(result.current[VALUE]).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
  });

  it('Supports null as a key', () => {
    const store = { x: 1, y: 'y' };
    const wrapper = getWrapper(store);

    let renderedTimes = 0;

    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(store, null);
    }, { wrapper });

    expect(result.current[VALUE]).toBe(undefined);
    expect(renderedTimes).toBe(1);
    expect('null' in store).toBe(false);

    // @ts-expect-error - null is not a valid key
    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(undefined);
    expect(renderedTimes).toBe(1);
  });

  it('Supports undefined as a key', () => {
    const store = { x: 1, y: 'y' };
    const wrapper = getWrapper(store);

    let renderedTimes = 0;

    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(store, undefined);
    }, { wrapper });

    expect(result.current[VALUE]).toBe(undefined);
    expect(renderedTimes).toBe(1);

    expect('undefined' in store).toBe(false);

    // @ts-expect-error - null is not a valid key
    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(undefined);
    expect(renderedTimes).toBe(1);
  });
});
