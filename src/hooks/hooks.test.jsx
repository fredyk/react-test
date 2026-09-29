import { act, renderHook, waitFor } from '@testing-library/react';
import { ApiProvider } from '../context/ApiProvider.jsx';
import { useProducts } from './useProducts.js';
import { fakeApi, products } from '../test/fixtures.js';

function wrapperFor(api) {
  return function Wrapper({ children }) {
    return <ApiProvider api={api}>{children}</ApiProvider>;
  };
}

describe('useProducts', () => {
  it('exposes data after loading', async () => {
    const api = fakeApi();
    const { result } = renderHook(() => useProducts(), { wrapper: wrapperFor(api) });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(products);
    expect(result.current.error).toBeNull();
  });

  it('surfaces the error and recovers on retry', async () => {
    const api = fakeApi({
      getProducts: vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue(products),
    });
    const { result } = renderHook(() => useProducts(), { wrapper: wrapperFor(api) });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.loading).toBe(false);

    act(() => result.current.retry());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.data).toEqual(products));
    expect(result.current.error).toBeNull();
  });
});
