export function ProductImage({ src, alt, className }) {
  return <img className={className ?? 'product-image'} src={src} alt={alt} loading="lazy" />;
}
