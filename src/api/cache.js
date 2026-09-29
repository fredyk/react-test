export const ONE_HOUR_MS = 60 * 60 * 1000;
const KEY_PREFIX = 'itx-cache:';

function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function createCache({
  storage = defaultStorage(),
  ttlMs = ONE_HOUR_MS,
  now = () => Date.now(),
} = {}) {
  // Memory backs up the storage when it is blocked or full, so the cache never breaks the app.
  const memory = new Map();
  // One request per key: concurrent callers share the same promise instead of fetching twice.
  const inFlight = new Map();

  function read(key) {
    let entry = memory.get(key);
    try {
      const raw = storage?.getItem(KEY_PREFIX + key);
      if (raw) entry = JSON.parse(raw);
    } catch {}
    if (!entry || typeof entry.storedAt !== 'number') return undefined;
    if (now() - entry.storedAt >= ttlMs) {
      remove(key);
      return undefined;
    }
    return entry;
  }

  function write(key, value) {
    const entry = { storedAt: now(), value };
    memory.set(key, entry);
    try {
      storage?.setItem(KEY_PREFIX + key, JSON.stringify(entry));
    } catch {}
  }

  function remove(key) {
    memory.delete(key);
    try {
      storage?.removeItem(KEY_PREFIX + key);
    } catch {}
  }

  async function getOrLoad(key, loader) {
    const cached = read(key);
    if (cached) return cached.value;
    if (inFlight.has(key)) return inFlight.get(key);

    // Only successes are written, so a failed request is retried on the next call.
    const pending = Promise.resolve()
      .then(loader)
      .then((value) => {
        write(key, value);
        return value;
      })
      .finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
    return pending;
  }

  return { getOrLoad, remove };
}
