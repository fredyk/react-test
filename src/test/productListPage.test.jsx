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

  it('filters by brand and model as the user types', async () => {
    const { user } = renderApp({ route: '/' });
    await screen.findByText('iPhone 12');

    await user.type(screen.getByRole('searchbox'), 'apple');

    expect(screen.getByText('iPhone 12')).toBeInTheDocument();
    expect(screen.queryByText('Iconia Talk S')).not.toBeInTheDocument();
  });

  it('reports the number of matching products', async () => {
    const { user } = renderApp({ route: '/' });
    await screen.findByText('iPhone 12');

    await user.type(screen.getByRole('searchbox'), 'samsung');

    expect(screen.getByTestId('results-count')).toHaveTextContent('1 product');
  });

  it('keeps the caret where the user is typing', async () => {
    const { user } = renderApp({ route: '/' });
    await screen.findByText('iPhone 12');
    const input = screen.getByRole('searchbox');

    await user.type(input, 'iphne');
    await user.type(input, 'o 1', { initialSelectionStart: 3, initialSelectionEnd: 3 });

    expect(input).toHaveValue('ipho 1ne');
  });

  it('shows everything again when the search is cleared', async () => {
    const { user } = renderApp({ route: '/' });
    await screen.findByText('iPhone 12');

    await user.type(screen.getByRole('searchbox'), 'apple');
    await user.clear(screen.getByRole('searchbox'));

    expect(screen.getByTestId('results-count')).toHaveTextContent('3 products');
  });

  it('restores the search from the url', async () => {
    renderApp({ route: '/?q=acer' });
    await screen.findByText('Iconia Talk S');

    expect(screen.getByRole('searchbox')).toHaveValue('acer');
    expect(screen.queryByText('iPhone 12')).not.toBeInTheDocument();
  });

  it('clears the search when the shop title takes the user home', async () => {
    const { user } = renderApp({ route: '/?q=acer' });
    await screen.findByText('Iconia Talk S');

    await user.click(screen.getByRole('link', { name: /itx mobile shop/i }));

    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByTestId('results-count')).toHaveTextContent('3 products');
  });

  it('links each item to its detail page keeping the query', async () => {
    const { user } = renderApp({ route: '/' });
    await screen.findByText('iPhone 12');

    await user.type(screen.getByRole('searchbox'), 'apple');

    expect(screen.getByRole('link', { name: /apple iphone 12/i })).toHaveAttribute(
      'href',
      '/product/apple-1?q=apple',
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
