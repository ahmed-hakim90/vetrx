import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simple scroll restoration: jump to top on every route change. This is the
// common SPA default; it does not restore the exact prior scroll offset on
// back/forward navigation (a fuller implementation would track per-path
// scroll position), which is a reasonable, documented simplification here.
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
