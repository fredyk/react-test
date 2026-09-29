import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useProduct } from '../hooks/useProduct.js';
import { Breadcrumbs } from './Breadcrumbs.jsx';

// The header renders in the layout route, above product/:productId, so useParams cannot see the id.
function productIdFrom(pathname) {
  const match = /^\/product\/([^/]+)/.exec(pathname);
  return match ? decodeURIComponent(match[1]) : null;
}

export function Header() {
  const { count } = useCart();
  const location = useLocation();
  const productId = productIdFrom(location.pathname);
  // Same cache key as the detail page, so the breadcrumb does not cost a second request.
  const { data } = useProduct(productId);
  const product = productId ? data : null;

  return (
    <header className="header">
      <div className="header__bar">
        <Link className="header__title" to="/">
          ITX Mobile Shop
        </Link>
        <p className="header__cart">
          Cart <span data-testid="cart-count">{count}</span>
        </p>
      </div>
      <Breadcrumbs pathname={location.pathname} search={location.search} product={product} />
    </header>
  );
}
