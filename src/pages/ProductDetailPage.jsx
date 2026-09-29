import { Link, useParams } from 'react-router-dom';

export function ProductDetailPage() {
  const { productId } = useParams();

  return (
    <section className="pdp">
      <Link to="/">Back to products</Link>
      <h1>Product {productId}</h1>
    </section>
  );
}
