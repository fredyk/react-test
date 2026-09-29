import { useEffect, useState } from 'react';
import { CART_COUNT_KEY, CartContext, readCartCount, writeCartCount } from './CartContext.js';

export function CartProvider({ storage, children }) {
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

  return <CartContext.Provider value={{ count }}>{children}</CartContext.Provider>;
}
