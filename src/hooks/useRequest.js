import { useEffect, useState } from 'react';

// Runs request() and exposes { data, error, loading, retry }. The result is tagged with the request
// and attempt it belongs to, so a slow answer for an old request never shows up as the current one.
export function useRequest(request, initialData) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ request: null, attempt: -1, data: null, error: null });

  useEffect(() => {
    if (!request) return undefined;
    let active = true;
    request().then(
      (data) => {
        if (active) setResult({ request, attempt, data, error: null });
      },
      (error) => {
        if (active) setResult({ request, attempt, data: null, error });
      },
    );
    return () => {
      active = false;
    };
  }, [request, attempt]);

  const settled = result.request === request && result.attempt === attempt;

  return {
    data: settled && result.data !== null ? result.data : initialData,
    error: settled ? result.error : null,
    loading: !settled,
    retry: () => setAttempt((value) => value + 1),
  };
}
