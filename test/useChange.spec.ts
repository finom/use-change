import { renderHook, act } from '@testing-library/react-hooks';
import useChange from '../src';
import getWrapper from './getWrapper';

const VALUE = 0;
const SET = 1;

describe('useChange', () => {
  it('Explicit overload', () => {
    const store: { x: number, foo?: unknown } = { x: 1 };
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
  });

  it('Implicit overload', () => {
    const store: { x: { y: number }, foo?: unknown } = { x: { y: 1 } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(({ x }: typeof store) => x, 'y');
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
  });

  it('Implicit root store overload', () => {
    const store: { x: number, foo?: unknown } = { x: 1 };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange<typeof store, 'x'>('x');
    }, { wrapper });

    expect(result.current[VALUE]).toBe(1);
    expect(renderedTimes).toBe(1);
    expect(store.x).toBe(1);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x).toBe(2);

    act(() => { result.current[SET](2); });

    expect(result.current[VALUE]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x).toBe(2);

    act(() => { store.x = 3; });

    expect(result.current[VALUE]).toBe(3);
    expect(store.x).toBe(3);
    expect(renderedTimes).toBe(3);
  });
});
