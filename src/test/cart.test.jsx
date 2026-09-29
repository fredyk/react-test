import { act, screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders, AppRoutes } from '../App.jsx';
import { fakeApi } from './fixtures.js';
import { renderApp } from './renderApp.jsx';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

function renderWithStorage(storage) {
  const api = fakeApi();
  const user = userEvent.setup();
  const utils = render(
    <AppProviders api={api} storage={storage}>
      <MemoryRouter initialEntries={['/product/acer-1']}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  );
  return { ...utils, api, user };
}

async function addToCart(user) {
  await screen.findByRole('heading', { name: /acer iconia talk s/i });
  await user.click(screen.getByRole('radio', { name: '32 GB' }));
  await user.click(screen.getByRole('button', { name: 'Add' }));
  await screen.findByText('Added to cart');
}

describe('Cart', () => {
  it('sums the count returned by the api on every add', async () => {
    const { user } = renderApp({ route: '/product/acer-1' });
    await addToCart(user);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => expect(screen.getByTestId('cart-count')).toHaveTextContent('2'));
  });

  it('persists the count across an unmount and a new mount', async () => {
    const first = renderApp({ route: '/product/acer-1' });
    await addToCart(first.user);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

    first.unmount();

    renderApp({ route: '/product/acer-1' });
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  it('persists the count in the storage given to the provider', async () => {
    const storage = memoryStorage();
    const first = renderWithStorage(storage);
    await addToCart(first.user);
    expect(storage.getItem('itx-cart-count')).toBe('1');

    first.unmount();

    renderWithStorage(storage);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  it('synchronises the count from another tab through the storage event', async () => {
    renderApp({ route: '/' });
    expect(await screen.findByTestId('cart-count')).toHaveTextContent('0');

    act(() => {
      globalThis.dispatchEvent(
        new StorageEvent('storage', { key: 'itx-cart-count', newValue: '4' }),
      );
    });

    expect(screen.getByTestId('cart-count')).toHaveTextContent('4');
  });

  it('shows the persisted count in the header on any view', async () => {
    const { user } = renderApp({ route: '/product/acer-1' });
    await addToCart(user);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

    await user.click(screen.getByRole('link', { name: /back to products/i }));

    expect(await screen.findByRole('heading', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });
});
