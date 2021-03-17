import { renderHook, act } from '@testing-library/react-hooks';
import useChange from '../src';
import getWrapper from './getWrapper';

describe('useChange', () => {
  it('Should work', () => {
    const store = { x: 1 };
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(store, 'x');
    });

    expect(result.current[0]).toBe(1);
    expect(store.x).toBe(1);
    expect(renderedTimes).toBe(1);

    act(() => { result.current[1](2); });

    expect(result.current[0]).toBe(2);
    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(2);

    act(() => { result.current[1](2); });

    expect(result.current[0]).toBe(2);
    expect(store.x).toBe(2);
    expect(renderedTimes).toBe(2);
  });

  it('Should use store selector', () => {
    const store = { x: { y: 1 } };
    const wrapper = getWrapper(store);
    let renderedTimes = 0;
    const { result } = renderHook(() => {
      renderedTimes += 1;
      return useChange(({ x }) => x, 'y');
    }, { wrapper });

    expect(result.current[0]).toBe(1);
    expect(renderedTimes).toBe(1);
    expect(store.x.y).toBe(1);

    act(() => { result.current[1](2); });

    expect(result.current[0]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x.y).toBe(2);

    act(() => { result.current[1](2); });

    expect(result.current[0]).toBe(2);
    expect(renderedTimes).toBe(2);
    expect(store.x.y).toBe(2);
  });
});
