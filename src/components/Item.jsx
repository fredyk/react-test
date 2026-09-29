import { Link } from 'react-router-dom';
import { formatPrice, PRICE_ON_REQUEST } from '../utils/formatPrice.js';
import { ProductImage } from './ProductImage.jsx';

export function Item({ product }) {
  const price = formatPrice(product.price);
  const title = `${product.brand} ${product.model}`;

  return (
    <li className="item">
      <Link className="item__link" to={`/product/${encodeURIComponent(product.id)}`}>
        <ProductImage className="item__image" src={product.imgUrl} alt={title} />
        <span className="item__brand">{product.brand}</span>
        <span className="item__model">{product.model}</span>
        <span className="item__price">{price ?? PRICE_ON_REQUEST}</span>
      </Link>
    </li>
  );
}
