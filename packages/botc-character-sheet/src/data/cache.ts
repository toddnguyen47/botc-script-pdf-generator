export function createCache<T>(ttl: number) {
  let value: T | undefined;
  let expiresAt = 0;
  let pending: Promise<T> | undefined;

  return async function get(fetcher: () => Promise<T>): Promise<T> {
    // Return cached value if it hasn't expired.
    if (value !== undefined && Date.now() < expiresAt) {
      return value;
    }

    // Reuse an existing request.
    if (pending) {
      return pending;
    }

    pending = fetcher()
      .then((result) => {
        value = result;
        expiresAt = Date.now() + ttl;
        return result;
      })
      .finally(() => {
        pending = undefined;
      });

    return pending;
  };
}
