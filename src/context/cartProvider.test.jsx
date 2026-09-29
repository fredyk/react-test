import { act, render, renderHook, screen } from '@testing-library/react';
import { CartProvider } from './CartProvider.jsx';
import { CART_COUNT_KEY, useCart } from './CartContext.js';
import { renderApp } from '../test/renderApp.jsx';
import { ApiProvider } from './ApiProvider.jsx';
import { fakeApi } from '../test/fixtures.js';

function withApi({ children }) {
  return (
    <ApiProvider api={fakeApi()}>
      <CartProvider>{children}</CartProvider>
    </ApiProvider>
  );
}

function renderCart() {
  return renderHook(() => useCart(), { wrapper: withApi });
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
      <ApiProvider api={fakeApi()}>
        <CartProvider storage={broken}>
          <Count />
        </CartProvider>
      </ApiProvider>,
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

  it('adds every concurrent response to the count', async () => {
    const api = fakeApi();
    const wrapper = ({ children }) => (
      <ApiProvider api={api}>
        <CartProvider>{children}</CartProvider>
      </ApiProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 'acer-1', colorCode: 1000, storageCode: 2000 };

    await act(() => Promise.all([result.current.addToCart(item), result.current.addToCart(item)]));

    expect(result.current.count).toBe(2);
    expect(localStorage.getItem(CART_COUNT_KEY)).toBe('2');
  });
});
