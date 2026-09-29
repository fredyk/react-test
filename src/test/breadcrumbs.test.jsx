import { screen, within } from '@testing-library/react';
import { renderApp } from './renderApp.jsx';

describe('Breadcrumbs', () => {
  it('marks the current page with Products on the list', async () => {
    renderApp({ route: '/' });

    const nav = await screen.findByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getByText('Products')).toHaveAttribute('aria-current', 'page');
  });

  it('shows Products › brand model on a product', async () => {
    renderApp({ route: '/product/apple-1' });

    const nav = await screen.findByRole('navigation', { name: 'Breadcrumb' });
    expect(await within(nav).findByText('Apple iPhone 12')).toHaveAttribute('aria-current', 'page');
  });

  it('links Products back to the list keeping the search query', async () => {
    renderApp({ route: '/product/acer-1?q=acer' });

    const nav = await screen.findByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/?q=acer');
  });
});
