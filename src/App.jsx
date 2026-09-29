import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProductListPage } from './pages/ProductListPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
