import { useCallback } from 'react';
import { useApi } from '../context/ApiContext.js';
import { useRequest } from './useRequest.js';

export function useProduct(id) {
  const api = useApi();
  const request = useCallback(() => api.getProduct(id), [api, id]);
  return useRequest(id ? request : null, null);
}
