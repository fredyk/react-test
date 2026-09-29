import { Link, useLocation, useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct.js';
import { productSpecs } from '../utils/productSpecs.js';
import { ProductImage } from '../components/ProductImage.jsx';
import { Description } from '../components/Description.jsx';
import { Retry } from '../components/Retry.jsx';

export function ProductDetailPage() {
  const { productId } = useParams();
  const location = useLocation();
  const { data, loading, error, retry } = useProduct(productId);
  // Back to the list with the same search the user came from.
  const backTo = `/${location.search}`;

  if (loading) {
    return (
      <section className="pdp">
        <p role="status">Loading product</p>
      </section>
    );
  }

  // A 404 is a wrong link, not an outage: no Retry, just the way back.
  if (error?.status === 404) {
    return (
      <section className="pdp">
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist.</p>
        <Link to="/">Back to products</Link>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="pdp">
        <p role="alert">Could not load the product</p>
        <Retry onRetry={retry} />
      </section>
    );
  }

  const title = `${data.brand} ${data.model}`;

  return (
    <section className="pdp">
      <Link className="pdp__back" to={backTo}>
        Back to products
      </Link>
      <div className="pdp__columns">
        <ProductImage className="pdp__image" src={data.imgUrl} alt={title} />
        <div className="pdp__details">
          <h1 className="pdp__title">{title}</h1>
          <Description specs={productSpecs(data)} />
        </div>
      </div>
    </section>
  );
}
