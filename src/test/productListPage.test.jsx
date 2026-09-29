import { screen, within } from '@testing-library/react';
import { renderApp } from './renderApp.jsx';
import { fakeApi, products } from './fixtures.js';

describe('Product list page', () => {
  it('shows a loading state until the products arrive', async () => {
    renderApp({ route: '/' });
    expect(screen.getByRole('status')).toHaveTextContent(/loading products/i);
    expect(await screen.findByText('iPhone 12')).toBeInTheDocument();
  });

  it('lists every product from the api', async () => {
    renderApp({ route: '/' });
    expect(await screen.findByText('iPhone 12')).toBeInTheDocument();
    expect(within(screen.getByTestId('product-grid')).getAllByRole('listitem')).toHaveLength(
      products.length,
    );
    expect(screen.getByTestId('results-count')).toHaveTextContent('3 products');
  });

  it('shows brand, model, price and image for each item', async () => {
    renderApp({ route: '/' });
    const link = await screen.findByRole('link', { name: /apple iphone 12/i });
    expect(within(link).getByText('Apple')).toBeInTheDocument();
    expect(within(link).getByText(/909/)).toBeInTheDocument();
    expect(within(link).getByRole('img')).toHaveAttribute('src', 'https://img.test/apple-1.jpg');
  });

  it('shows a placeholder price when the product has none', async () => {
    renderApp({ route: '/' });
    expect(await screen.findByText('Price on request')).toBeInTheDocument();
  });

  it('links each item to its detail page', async () => {
    renderApp({ route: '/' });
    expect(await screen.findByRole('link', { name: /apple iphone 12/i })).toHaveAttribute(
      'href',
      '/product/apple-1',
    );
  });

  it('offers a retry when the product list fails, and recovers', async () => {
    const api = fakeApi({
      getProducts: vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue(products),
    });
    const { user } = renderApp({ route: '/', api });

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load products/i);
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('iPhone 12')).toBeInTheDocument();
  });
});
