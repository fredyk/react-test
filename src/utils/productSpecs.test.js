import { productSpecs } from './productSpecs.js';

const detail = {
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
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
};

const asObject = (specs) => Object.fromEntries(specs.map(({ label, value }) => [label, value]));

describe('productSpecs', () => {
  it('lists the required attributes in order', () => {
    expect(productSpecs(detail).map((s) => s.label)).toEqual([
      'Brand',
      'Model',
      'Price',
      'CPU',
      'RAM',
      'Operating system',
      'Screen resolution',
      'Screen size',
      'Battery',
      'Main camera',
      'Front camera',
      'Dimensions',
      'Weight',
    ]);
  });

  it('puts the pixel value under resolution and the inches under size, whichever field brings them', () => {
    const specs = asObject(productSpecs(detail));
    expect(specs['Screen resolution']).toBe('720 x 1280 pixels (~210 ppi pixel density)');
    expect(specs['Screen size']).toBe('7.0 inches (~69.8% screen-to-body ratio)');

    const fixed = asObject(
      productSpecs({
        ...detail,
        displayResolution: detail.displaySize,
        displaySize: detail.displayResolution,
      }),
    );
    expect(fixed['Screen resolution']).toBe('720 x 1280 pixels (~210 ppi pixel density)');
  });

  it('joins camera lists and adds units to the weight and price', () => {
    const specs = asObject(productSpecs(detail));
    expect(specs['Main camera']).toBe('13 MP, autofocus');
    expect(specs['Front camera']).toBe('2 MP, 720p');
    expect(specs.Weight).toBe('260 g');
    expect(specs.Price).toMatch(/^170\s€$/);
  });

  it('shows "Not specified" for anything missing or empty', () => {
    const specs = asObject(
      productSpecs({ brand: 'X', model: 'Y', price: '', weight: '', primaryCamera: [] }),
    );
    expect(specs.CPU).toBe('Not specified');
    expect(specs.Weight).toBe('Not specified');
    expect(specs['Main camera']).toBe('Not specified');
    expect(specs.Price).toBe('Price on request');
  });
});
