import { formatPrice } from './formatPrice.js';

describe('formatPrice', () => {
  it('formats euros without decimals when the price is whole', () => {
    expect(formatPrice('170')).toMatch(/^170\s€$/);
  });

  it('keeps cents when there are any', () => {
    expect(formatPrice('99.5')).toMatch(/^99,50\s€$/);
  });

  it('returns null when there is no usable price', () => {
    expect(formatPrice('')).toBeNull();
    expect(formatPrice(undefined)).toBeNull();
    expect(formatPrice('abc')).toBeNull();
  });
});
