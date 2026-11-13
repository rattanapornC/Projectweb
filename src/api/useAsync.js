import { useEffect, useState } from 'react';

// hook เล็ก ๆ ไว้เรียก API แล้วได้สถานะ { status, data, error }
// status เป็น 'loading' | 'success' | 'error' (ใช้คู่กับ MangaGrid ได้เลย)
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading', data: null, error: null });
    fn()
      .then((data) => alive && setState({ status: 'success', data, error: null }))
      .catch((error) => alive && setState({ status: 'error', data: null, error }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
