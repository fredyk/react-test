import { act, renderHook, waitFor } from '@testing-library/react';
import { ApiProvider } from '../context/ApiProvider.jsx';
import { useProducts } from './useProducts.js';
import { useProduct } from './useProduct.js';
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

describe('useProduct', () => {
  it('exposes the product for the id', async () => {
    const api = fakeApi();
    const { result } = renderHook(() => useProduct('apple-1'), { wrapper: wrapperFor(api) });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toMatchObject({ id: 'apple-1', model: 'iPhone 12' });
  });

  it('does not request anything without an id', () => {
    const api = fakeApi();
    const { result } = renderHook(() => useProduct(null), { wrapper: wrapperFor(api) });

    expect(result.current.data).toBeNull();
    expect(api.getProduct).not.toHaveBeenCalled();
  });

  it('surfaces a 404 error', async () => {
    const api = fakeApi();
    const { result } = renderHook(() => useProduct('missing'), { wrapper: wrapperFor(api) });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.error.status).toBe(404);
  });

  it('does not expose the previous product while the next one loads', async () => {
    let resolveNext;
    const api = fakeApi({
      getProduct: vi.fn((id) =>
        id === 'first'
          ? Promise.resolve({ id: 'first' })
          : new Promise((resolve) => {
              resolveNext = resolve;
            }),
      ),
    });
    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      wrapper: wrapperFor(api),
      initialProps: { id: 'first' },
    });
    await waitFor(() => expect(result.current.data).toEqual({ id: 'first' }));

    rerender({ id: 'second' });
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await act(async () => resolveNext({ id: 'second' }));
    expect(result.current.data).toEqual({ id: 'second' });
  });
});
