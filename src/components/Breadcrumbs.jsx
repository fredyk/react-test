import { Link } from 'react-router-dom';

function isDetail(pathname) {
  return pathname.startsWith('/product/');
}

function currentCrumb(pathname, product) {
  if (pathname === '/') return null;
  if (isDetail(pathname)) return product ? `${product.brand} ${product.model}` : 'Product';
  return 'Page not found';
}

function productsHref(search) {
  return search ? `/${search}` : '/';
}

export function Breadcrumbs({ pathname, search = '', product }) {
  const current = currentCrumb(pathname, product);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          {current ? (
            <Link className="breadcrumbs__link" to={productsHref(search)}>
              Products
            </Link>
          ) : (
            <span aria-current="page">Products</span>
          )}
        </li>
        {current ? (
          <li className="breadcrumbs__item">
            <span aria-current="page">{current}</span>
          </li>
        ) : null}
      </ol>
    </nav>
  );
}
