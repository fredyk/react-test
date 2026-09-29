import { createContext, useContext } from 'react';

export const CART_COUNT_KEY = 'itx-cart-count';

// Anything that is not a positive number (missing, tampered, NaN) counts as an empty cart.
function toCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function readCartCount(storage) {
  try {
    return toCount(storage?.getItem(CART_COUNT_KEY));
  } catch {
    return 0;
  }
}

export function writeCartCount(storage, count) {
  try {
    storage?.setItem(CART_COUNT_KEY, String(toCount(count)));
  } catch {}
}

export const CartContext = createContext(null);

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return cart;
}
