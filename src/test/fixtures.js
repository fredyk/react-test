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

export const acerDetail = {
  ...products[0],
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  ram: '2 GB RAM',
  os: 'Android 6.0 (Marshmallow)',
  displayResolution: '7.0 inches (~69.8% screen-to-body ratio)',
  displaySize: '720 x 1280 pixels (~210 ppi pixel density)',
  battery: 'Non-removable Li-Ion 3400 mAh battery (12.92 Wh)',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: ['2 MP', '720p'],
  dimentions: '191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)',
  weight: '260',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [
      { code: 2000, name: '16 GB' },
      { code: 2001, name: '32 GB' },
    ],
  },
};

export const appleDetail = {
  ...products[1],
  options: {
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'White' },
    ],
    storages: [{ code: 2000, name: '64 GB' }],
  },
};

export function fakeApi(overrides = {}) {
  const details = { [acerDetail.id]: acerDetail, [appleDetail.id]: appleDetail };
  return {
    getProducts: vi.fn(async () => products),
    getProduct: vi.fn(async (id) => {
      if (!details[id]) {
        const error = new Error('not found');
        error.status = 404;
        throw error;
      }
      return details[id];
    }),
    addToCart: vi.fn(async () => 1),
    ...overrides,
  };
}
