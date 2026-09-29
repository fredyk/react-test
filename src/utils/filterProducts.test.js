import { filterProducts } from './filterProducts.js';

const products = [
  { id: '1', brand: 'Acer', model: 'Iconia Talk S' },
  { id: '2', brand: 'Apple', model: 'iPhone 12' },
  { id: '3', brand: 'Samsung', model: 'Galaxy S21' },
];

describe('filterProducts', () => {
  it('returns everything for an empty or blank query', () => {
    expect(filterProducts(products, '')).toEqual(products);
    expect(filterProducts(products, '   ')).toEqual(products);
  });

  it('matches brand and model, ignoring case', () => {
    expect(filterProducts(products, 'APPLE').map((p) => p.id)).toEqual(['2']);
    expect(filterProducts(products, 'galaxy').map((p) => p.id)).toEqual(['3']);
  });

  it('requires every word, across brand and model', () => {
    expect(filterProducts(products, 'samsung s21').map((p) => p.id)).toEqual(['3']);
    expect(filterProducts(products, 'samsung iphone')).toEqual([]);
  });

  it('ignores accents', () => {
    expect(filterProducts([{ id: '9', brand: 'Xiaomí', model: 'Mi' }], 'xiaomi')).toHaveLength(1);
  });

  it('copes with missing fields', () => {
    expect(filterProducts([{ id: '4', brand: 'Nokia' }], 'nokia')).toHaveLength(1);
  });
});
