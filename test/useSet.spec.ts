import { renderHook, act } from '@testing-library/react-hooks';
import { useSet } from '../src';
import getWrapper from './getWrapper';

describe('useSet', () => {
  it('Explicit overload', () => {
    const store = { x: 1 };
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useSet(store, 'x');
    });

    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current(2); });

    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(1);

    act(() => { store.x = 3; });

    expect(store.x).toBe(3);
    expect(renderedTimes).toBe(1);
  });

  it('Implicit overload', () => {
    const store = { x: { y: 1 } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useSet(({ x }: typeof store) => x, 'y');
    }, { wrapper });

    expect(store.x.y).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current(2); });

    expect(store.x.y).toBe(2);
    expect(renderedTimes).toBe(1);

    act(() => { store.x.y = 3; });

    expect(store.x.y).toBe(3);
    expect(renderedTimes).toBe(1);
  });

  it('Implicit root store overload', () => {
    const store = { x: 1 };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useSet<typeof store, 'x'>('x');
    }, { wrapper });

    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current(2); });

    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(1);

    act(() => { store.x = 3; });

    expect(store.x).toBe(3);
    expect(renderedTimes).toBe(1);
  });
});
