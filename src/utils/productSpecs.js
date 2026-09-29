import { formatPrice, PRICE_ON_REQUEST } from './formatPrice.js';

export const NOT_SPECIFIED = 'Not specified';

const PIXELS = /\d+\s*x\s*\d+\s*pixels/i;

function text(value) {
  if (Array.isArray(value)) value = value.filter(Boolean).join(', ');
  const trimmed = String(value ?? '').trim();
  return trimmed || NOT_SPECIFIED;
}

function withUnit(value, unit) {
  const trimmed = String(value ?? '').trim();
  return trimmed ? `${trimmed} ${unit}` : NOT_SPECIFIED;
}

// The API swaps these two fields: displayResolution brings the inches and displaySize the pixels.
// Whichever field holds "N x M pixels" is the resolution.
function screen({ displayResolution, displaySize }) {
  if (PIXELS.test(displaySize ?? '') && !PIXELS.test(displayResolution ?? '')) {
    return { resolution: displaySize, size: displayResolution };
  }
  return { resolution: displayResolution, size: displaySize };
}

export function productSpecs(product) {
  const { resolution, size } = screen(product);
  return [
    { label: 'Brand', value: text(product.brand) },
    { label: 'Model', value: text(product.model) },
    { label: 'Price', value: formatPrice(product.price) ?? PRICE_ON_REQUEST },
    { label: 'CPU', value: text(product.cpu) },
    { label: 'RAM', value: text(product.ram) },
    { label: 'Operating system', value: text(product.os) },
    { label: 'Screen resolution', value: text(resolution) },
    { label: 'Screen size', value: text(size) },
    { label: 'Battery', value: text(product.battery) },
    { label: 'Main camera', value: text(product.primaryCamera) },
    // secondaryCmera and dimentions are misspelt in the API; the right spelling is kept as a fallback.
    { label: 'Front camera', value: text(product.secondaryCmera ?? product.secondaryCamera) },
    { label: 'Dimensions', value: text(product.dimentions ?? product.dimensions) },
    { label: 'Weight', value: withUnit(product.weight, 'g') },
  ];
}
