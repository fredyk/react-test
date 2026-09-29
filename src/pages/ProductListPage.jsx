import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts.js';
import { filterProducts } from '../utils/filterProducts.js';
import { SearchBar } from '../components/SearchBar.jsx';
import { Item } from '../components/Item.jsx';
import { Retry } from '../components/Retry.jsx';

const FROM_SEARCH = { fromSearch: true };

function resultLabel(total) {
  return `${total} ${total === 1 ? 'product' : 'products'}`;
}

export function ProductListPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  // The input owns its text: the router updates the URL in a transition, and a controlled input
  // fed from the URL is rendered with the old value first, which throws the caret to the end.
  const [query, setQuery] = useState(urlQuery);
  const [locationKey, setLocationKey] = useState(location.key);
  const { data, loading, error, retry } = useProducts();
  const products = filterProducts(data, query);

  // A navigation that did not come from typing (header link, back and forward) brings its own ?q=.
  if (location.key !== locationKey) {
    setLocationKey(location.key);
    if (!location.state?.fromSearch) setQuery(urlQuery);
  }

  function handleSearch(value) {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    // The query lives in the URL (?q=) too, so it survives a reload and the way back from a detail
    // page. replace: typing must not push one history entry per keystroke.
    setSearchParams(next, { replace: true, state: FROM_SEARCH });
  }

  return (
    <section className="plp">
      <div className="plp__top">
        <h1 className="plp__title">Products</h1>
        <SearchBar value={query} onChange={handleSearch} />
      </div>
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
