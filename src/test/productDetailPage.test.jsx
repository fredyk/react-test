import { screen } from '@testing-library/react';
import { renderApp } from './renderApp.jsx';
import { fakeApi } from './fixtures.js';

describe('Product detail page', () => {
  it('shows a loading state until the product arrives', async () => {
    renderApp({ route: '/product/acer-1' });
    expect(screen.getByRole('status')).toHaveTextContent(/loading product/i);
    expect(await screen.findByRole('heading', { name: /acer iconia talk s/i })).toBeInTheDocument();
  });

  it('shows the product image next to its description', async () => {
    renderApp({ route: '/product/acer-1' });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    expect(screen.getByRole('img', { name: 'Acer Iconia Talk S' })).toHaveAttribute(
      'src',
      'https://img.test/acer-1.jpg',
    );
  });

  it('renders the description specs of the product', async () => {
    renderApp({ route: '/product/acer-1' });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    expect(screen.getByText('Quad-core 1.3 GHz Cortex-A53')).toBeInTheDocument();
    expect(screen.getByText('720 x 1280 pixels (~210 ppi pixel density)')).toBeInTheDocument();
    expect(screen.getByText('260 g')).toBeInTheDocument();
  });

  it('preselects the only colour and leaves the storages unchecked', async () => {
    renderApp({ route: '/product/acer-1' });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    expect(screen.getByRole('radio', { name: 'Black' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '16 GB' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: '32 GB' })).not.toBeChecked();
  });

  it('preselects the only storage on a product that has one', async () => {
    renderApp({ route: '/product/apple-1' });
    await screen.findByRole('heading', { name: /apple iphone 12/i });

    expect(screen.getByRole('radio', { name: '64 GB' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Black' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'White' })).not.toBeChecked();
  });

  it('lets the user pick one option per group', async () => {
    const { user } = renderApp({ route: '/product/acer-1' });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    await user.click(screen.getByRole('radio', { name: '16 GB' }));
    await user.click(screen.getByRole('radio', { name: '32 GB' }));

    expect(screen.getByRole('radio', { name: '32 GB' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '16 GB' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Black' })).toBeChecked();
  });

  it('keeps Add disabled until both options are chosen', async () => {
    const { user } = renderApp({ route: '/product/acer-1' });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    const add = screen.getByRole('button', { name: 'Add' });
    expect(add).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: '32 GB' }));
    expect(add).toBeEnabled();
  });

  it('adds the chosen options to the cart and confirms', async () => {
    const { user, api } = renderApp({ route: '/product/acer-1' });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    await user.click(screen.getByRole('radio', { name: '32 GB' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Added to cart')).toBeInTheDocument();
    expect(api.addToCart).toHaveBeenCalledWith({
      id: 'acer-1',
      colorCode: 1000,
      storageCode: 2001,
    });
  });

  it('shows an error message when the cart request fails', async () => {
    const api = fakeApi({ addToCart: vi.fn().mockRejectedValue(new Error('boom')) });
    const { user } = renderApp({ route: '/product/acer-1', api });
    await screen.findByRole('heading', { name: /acer iconia talk s/i });

    await user.click(screen.getByRole('radio', { name: '32 GB' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Could not add to cart')).toBeInTheDocument();
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('links back to the list keeping the query', async () => {
    renderApp({ route: '/product/apple-1?q=apple' });

    expect(await screen.findByRole('link', { name: /back to products/i })).toHaveAttribute(
      'href',
      '/?q=apple',
    );
  });

  it('reports a missing product without crashing', async () => {
    renderApp({ route: '/product/does-not-exist' });

    expect(await screen.findByRole('heading', { name: /product not found/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('distinguishes a network error from a missing product, and recovers on retry', async () => {
    // Both the page and the breadcrumb ask for the product, so the outage is a switch, not one call.
    let networkDown = true;
    const { getProduct } = fakeApi();
    const api = fakeApi({
      getProduct: vi.fn((id) =>
        networkDown ? Promise.reject(new Error('network down')) : getProduct(id),
      ),
    });
    const { user } = renderApp({ route: '/product/acer-1', api });

    expect(await screen.findByText('Could not load the product')).toBeInTheDocument();
    expect(screen.queryByText(/product not found/i)).not.toBeInTheDocument();

    networkDown = false;
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByRole('heading', { name: /acer iconia talk s/i })).toBeInTheDocument();
  });
});
