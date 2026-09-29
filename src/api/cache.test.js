import { createCache } from './cache.js';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    size: () => data.size,
  };
}

const HOUR = 60 * 60 * 1000;

describe('createCache', () => {
  it('loads once and serves the stored value while it is fresh', async () => {
    let now = 0;
    const cache = createCache({ storage: memoryStorage(), now: () => now });
    const loader = vi.fn().mockResolvedValue(['a']);

    expect(await cache.getOrLoad('products', loader)).toEqual(['a']);
    now = HOUR - 1;
    expect(await cache.getOrLoad('products', loader)).toEqual(['a']);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('revalidates once the entry is one hour old', async () => {
    let now = 0;
    const cache = createCache({ storage: memoryStorage(), now: () => now });
    const loader = vi.fn().mockResolvedValueOnce(['old']).mockResolvedValueOnce(['new']);

    await cache.getOrLoad('products', loader);
    now = HOUR;
    expect(await cache.getOrLoad('products', loader)).toEqual(['new']);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('survives a reload because entries live in the given storage', async () => {
    const storage = memoryStorage();
    await createCache({ storage, now: () => 0 }).getOrLoad('k', async () => 42);

    const loader = vi.fn();
    expect(await createCache({ storage, now: () => 10 }).getOrLoad('k', loader)).toBe(42);
    expect(loader).not.toHaveBeenCalled();
  });

  it('shares one in-flight request between concurrent callers', async () => {
    const cache = createCache({ storage: memoryStorage() });
    const loader = vi.fn().mockResolvedValue('value');

    const [first, second] = await Promise.all([
      cache.getOrLoad('k', loader),
      cache.getOrLoad('k', loader),
    ]);
    expect(first).toBe('value');
    expect(second).toBe('value');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('does not store failures, so the next call retries', async () => {
    const cache = createCache({ storage: memoryStorage() });
    const loader = vi.fn().mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce('ok');

    await expect(cache.getOrLoad('k', loader)).rejects.toThrow('down');
    expect(await cache.getOrLoad('k', loader)).toBe('ok');
  });

  it('ignores corrupted entries', async () => {
    const storage = memoryStorage();
    storage.setItem('itx-cache:k', '{not json');
    const cache = createCache({ storage });

    expect(await cache.getOrLoad('k', async () => 'fresh')).toBe('fresh');
  });

  it('keeps working in memory when the storage throws', async () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    const cache = createCache({ storage: broken });
    const loader = vi.fn().mockResolvedValue('v');

    await cache.getOrLoad('k', loader);
    expect(await cache.getOrLoad('k', loader)).toBe('v');
    expect(loader).toHaveBeenCalledTimes(1);
  });
});
