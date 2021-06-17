import { renderHook, act } from '@testing-library/react-hooks';
import { useGet } from '../src';
import getWrapper from './getWrapper';

describe('useGet', () => {
  it('Explicit overload', () => {
    const store = { x: 1 };
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useGet(store, 'x');
    });

    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { expect(result.current()).toBe(1); });

    store.x = 2;

    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(1);

    act(() => { expect(result.current()).toBe(2); });
  });

  it('Implicit overload', () => {
    const store = { x: { y: 1 } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useGet(({ x }: typeof store) => x, 'y');
    }, { wrapper });

    expect(store.x.y).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { expect(result.current()).toBe(1); });
  });

  it('Implicit root store overload', () => {
    const store = { x: 1 };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useGet<typeof store, 'x'>('x');
    }, { wrapper });

    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { expect(result.current()).toBe(1); });

    store.x = 2;

    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(1);

    act(() => { expect(result.current()).toBe(2); });
  });
});
