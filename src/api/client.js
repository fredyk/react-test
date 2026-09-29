import { createCache } from './cache.js';

export const API_BASE_URL = 'https://itx-frontend-test.onrender.com/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function createApi({
  fetchImpl = (...args) => globalThis.fetch(...args),
  cache = createCache(),
  baseUrl = API_BASE_URL,
} = {}) {
  async function request(path, init) {
    const response = await fetchImpl(`${baseUrl}${path}`, init);
    if (!response.ok) {
      throw new ApiError(
        `Request to ${path} failed with status ${response.status}`,
        response.status,
      );
    }
    return response.json();
  }

  return {
    getProducts() {
      return cache.getOrLoad('products', () => request('/product'));
    },

    getProduct(id) {
      return cache.getOrLoad(`product:${id}`, () => request(`/product/${encodeURIComponent(id)}`));
    },

    async addToCart({ id, colorCode, storageCode }) {
      const body = await request('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, colorCode, storageCode }),
      });
      // The count is what the header shows: a body without it is a failure, not a zero.
      if (typeof body?.count !== 'number') {
        throw new ApiError('Cart response has no count', 200);
      }
      return body.count;
    },
  };
}
