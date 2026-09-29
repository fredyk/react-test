import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createApi } from './api/client.js';
import { ApiProvider } from './context/ApiProvider.jsx';
import { CartProvider } from './context/CartProvider.jsx';
import { Layout } from './components/Layout.jsx';
import { ProductListPage } from './pages/ProductListPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const defaultApi = createApi();

// Tests pass a fake api through the same providers the app uses.
export function AppProviders({ api, storage, children }) {
  return (
    <ApiProvider api={api}>
      <CartProvider storage={storage}>{children}</CartProvider>
    </ApiProvider>
  );
}

// Routes live apart from the router so tests can mount them inside a MemoryRouter.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ProductListPage />} />
        <Route path="product/:productId" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProviders api={defaultApi}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
