import { useCallback } from 'react';
import { useApi } from '../context/ApiContext.js';
import { useRequest } from './useRequest.js';

// Stable empty list: the page can map over data while loading without a new array per render.
const NO_PRODUCTS = [];

export function useProducts() {
  const api = useApi();
  const request = useCallback(() => api.getProducts(), [api]);
  return useRequest(request, NO_PRODUCTS);
}
