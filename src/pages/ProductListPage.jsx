import { useProducts } from '../hooks/useProducts.js';
import { Item } from '../components/Item.jsx';
import { Retry } from '../components/Retry.jsx';

function resultLabel(total) {
  return `${total} ${total === 1 ? 'product' : 'products'}`;
}

export function ProductListPage() {
  const { data: products, loading, error, retry } = useProducts();

  return (
    <section className="plp">
      <h1 className="plp__title">Products</h1>
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
