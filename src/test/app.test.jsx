import { screen } from '@testing-library/react';
import { renderApp } from './renderApp.jsx';

describe('App shell', () => {
  it('renders the header on the product list page', async () => {
    renderApp({ route: '/' });
    expect(await screen.findByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
  });

  it('links the shop title back to the home page', async () => {
    renderApp({ route: '/product/abc' });
    const link = await screen.findByRole('link', { name: /itx mobile shop/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('shows the cart count in the header on any view', async () => {
    renderApp({ route: '/product/abc' });
    expect(await screen.findByTestId('cart-count')).toHaveTextContent('0');
  });

  it('routes /product/:productId to the detail page with the header', async () => {
    renderApp({ route: '/product/abc' });
    expect(await screen.findByRole('heading', { name: /product abc/i })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('goes back to the list from the detail page', async () => {
    const { user } = renderApp({ route: '/product/abc' });
    await user.click(await screen.findByRole('link', { name: /back to products/i }));
    expect(await screen.findByRole('heading', { name: /products/i })).toBeInTheDocument();
  });

  it('shows a not found page for an unknown route', async () => {
    renderApp({ route: '/this-route-does-not-exist' });
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
