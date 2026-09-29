// Some products come from the API without a price: the UI shows this instead of an empty tag.
export const PRICE_ON_REQUEST = 'Price on request';

const wholeEuros = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// Returns null when there is nothing to show, so each view decides its own fallback.
export function formatPrice(price) {
  if (price === '' || price === null || price === undefined) return null;
  const amount = Number(price);
  if (!Number.isFinite(amount)) return null;
  return (Number.isInteger(amount) ? wholeEuros : euros).format(amount);
}
