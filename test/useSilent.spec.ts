import { renderHook, act } from '@testing-library/react-hooks';
import { useSilent } from '../src';
import getWrapper from './getWrapper';

describe('useSilent', () => {
  it('Explicit overload', () => {
    const store = { x: 1 };
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useSilent(store, 'x');
    });

    expect(result.current).toBe(1);
    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { store.x = 2; });

    expect(result.current).toBe(1);
    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(1);
  });

  it('Implicit overload', () => {
    const store = { x: { y: 1 } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useSilent(({ x }: typeof store) => x, 'y');
    }, { wrapper });

    expect(result.current).toBe(1);
    expect(renderedTimes).toBe(1);
    expect(store.x.y).toBe(1);

    act(() => { store.x.y = 2; });

    expect(result.current).toBe(1);
    expect(store.x.y).toBe(2);
    expect(renderedTimes).toBe(1);
  });
});
