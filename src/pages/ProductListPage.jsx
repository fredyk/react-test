import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts.js';
import { filterProducts } from '../utils/filterProducts.js';
import { SearchBar } from '../components/SearchBar.jsx';
import { Item } from '../components/Item.jsx';
import { Retry } from '../components/Retry.jsx';

function resultLabel(total) {
  return `${total} ${total === 1 ? 'product' : 'products'}`;
}

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // The query lives in the URL (?q=), so it survives a reload and the way back from a detail page.
  const query = searchParams.get('q') ?? '';
  const { data, loading, error, retry } = useProducts();
  const products = filterProducts(data, query);

  function handleSearch(value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    // replace: typing must not push one history entry per keystroke.
    setSearchParams(next, { replace: true });
  }

  return (
    <section className="plp">
      <h1 className="plp__title">Products</h1>
      <SearchBar value={query} onChange={handleSearch} />
      {loading ? (
        <p className="plp__status" role="status">
          Loading products
        </p>
      ) : error ? (
        <div className="plp__error">
          <p role="alert">Could not load products</p>
          <Retry onRetry={retry} />
        </div>
      ) : (
        <>
          <p className="plp__count" data-testid="results-count" aria-live="polite">
            {resultLabel(products.length)}
          </p>
          <ul className="plp__grid" data-testid="product-grid">
            {products.map((product) => (
              <Item key={product.id} product={product} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
