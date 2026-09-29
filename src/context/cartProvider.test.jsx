import { act, render, renderHook, screen } from '@testing-library/react';
import { CartProvider } from './CartProvider.jsx';
import { CART_COUNT_KEY, useCart } from './CartContext.js';
import { renderApp } from '../test/renderApp.jsx';

function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

describe('CartProvider', () => {
  it('starts at zero with an empty storage', () => {
    expect(renderCart().result.current.count).toBe(0);
  });

  it('restores the count saved by a previous visit', () => {
    localStorage.setItem(CART_COUNT_KEY, '3');
    expect(renderCart().result.current.count).toBe(3);
  });

  it('treats a tampered value as an empty cart', () => {
    localStorage.setItem(CART_COUNT_KEY, 'lots');
    expect(renderCart().result.current.count).toBe(0);
  });

  it('keeps working when the storage throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };
    function Count() {
      return <span data-testid="count">{useCart().count}</span>;
    }
    render(
      <CartProvider storage={broken}>
        <Count />
      </CartProvider>,
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('follows the count written by another tab', () => {
    const { result } = renderCart();

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: CART_COUNT_KEY, newValue: '4' }));
    });

    expect(result.current.count).toBe(4);
  });

  it('shows the persisted count in the header after a reload', async () => {
    localStorage.setItem(CART_COUNT_KEY, '2');
    renderApp({ route: '/' });
    expect(await screen.findByTestId('cart-count')).toHaveTextContent('2');
  });

  it('fails loudly when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => act(() => renderHook(() => useCart()))).toThrow(/CartProvider/);
  });
});
