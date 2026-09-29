export const products = [
  {
    id: 'acer-1',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    imgUrl: 'https://img.test/acer-1.jpg',
  },
  {
    id: 'apple-1',
    brand: 'Apple',
    model: 'iPhone 12',
    price: '909',
    imgUrl: 'https://img.test/apple-1.jpg',
  },
  {
    id: 'samsung-1',
    brand: 'Samsung',
    model: 'Galaxy S21',
    price: '',
    imgUrl: 'https://img.test/samsung-1.jpg',
  },
];

export function fakeApi(overrides = {}) {
  return {
    getProducts: vi.fn(async () => products),
    ...overrides,
  };
}
