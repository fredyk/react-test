import { useEffect, useState } from 'react';
import { useApi } from './ApiContext.js';
import { CART_COUNT_KEY, CartContext, readCartCount, writeCartCount } from './CartContext.js';

export function CartProvider({ storage, children }) {
  const api = useApi();
  const [cartStorage] = useState(() => storage ?? globalThis.localStorage ?? null);
  const [count, setCount] = useState(() => readCartCount(cartStorage));

  useEffect(() => {
    writeCartCount(cartStorage, count);
  }, [cartStorage, count]);

  // Another tab changed the count: the storage event only fires in the other tabs, never in the one
  // that wrote it.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== CART_COUNT_KEY) return;
      const next = Number(event.newValue);
      setCount(Number.isFinite(next) && next > 0 ? next : 0);
    }
    globalThis.addEventListener('storage', handleStorage);
    return () => globalThis.removeEventListener('storage', handleStorage);
  }, []);

  function addToCart({ id, colorCode, storageCode }) {
    return api.addToCart({ id, colorCode, storageCode }).then((added) => {
      // The API answers how many units this request added (always 1), not the cart total: it is added
      // to the count, and the functional update keeps two concurrent adds from losing one.
      setCount((current) => current + added);
      return added;
    });
  }

  return <CartContext.Provider value={{ count, addToCart }}>{children}</CartContext.Provider>;
}
