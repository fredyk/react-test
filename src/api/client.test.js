import { API_BASE_URL, ApiError, createApi } from './client.js';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function passthroughCache() {
  return { getOrLoad: (_key, loader) => loader() };
}

describe('createApi', () => {
  it('gets the product list', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([{ id: '1' }]));
    const api = createApi({ fetchImpl, cache: passthroughCache() });

    expect(await api.getProducts()).toEqual([{ id: '1' }]);
    expect(fetchImpl).toHaveBeenCalledWith(`${API_BASE_URL}/product`, undefined);
  });

  it('gets a product by id', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ id: 'a b' }));
    const api = createApi({ fetchImpl, cache: passthroughCache() });

    expect(await api.getProduct('a b')).toEqual({ id: 'a b' });
    expect(fetchImpl).toHaveBeenCalledWith(`${API_BASE_URL}/product/a%20b`, undefined);
  });

  it('adds to the cart and returns the count', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ count: 1 }));
    const api = createApi({ fetchImpl, cache: passthroughCache() });

    expect(await api.addToCart({ id: 'x', colorCode: 1000, storageCode: 2001 })).toBe(1);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/cart`);
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body)).toEqual({ id: 'x', colorCode: 1000, storageCode: 2001 });
  });

  it('caches reads under stable keys', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse([]));
    const cache = { getOrLoad: vi.fn((_key, loader) => loader()) };
    const api = createApi({ fetchImpl, cache });

    await api.getProducts();
    await api.getProduct('7');
    expect(cache.getOrLoad.mock.calls.map(([key]) => key)).toEqual(['products', 'product:7']);
  });

  it('uses the browser cache by default, so a second read does not hit the network', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse([{ id: '1' }]));
    const api = createApi({ fetchImpl });

    await api.getProducts();
    expect(await api.getProducts()).toEqual([{ id: '1' }]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('never caches the cart', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ count: 1 }));
    const cache = { getOrLoad: vi.fn() };
    const api = createApi({ fetchImpl, cache });

    await api.addToCart({ id: 'x', colorCode: 1, storageCode: 2 });
    expect(cache.getOrLoad).not.toHaveBeenCalled();
  });

  it('rejects with an ApiError carrying the status when the response is not ok', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ message: 'nope' }, 404));
    const api = createApi({ fetchImpl, cache: passthroughCache() });

    const error = await api.getProduct('missing').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
  });

  it('rejects with an ApiError when the cart response has no numeric count', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const api = createApi({ fetchImpl, cache: passthroughCache() });

    await expect(api.addToCart({ id: 'x', colorCode: 1, storageCode: 2 })).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
