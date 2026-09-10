import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider, useStore } from './StoreContext';

vi.mock('../config/active-client', () => ({ activeClient: {
  id: 'shams', defaultLocale: 'en', supportedLocales: ['en', 'ar'], defaultCurrency: 'EGP',
  commerce: { provider: 'woocommerce', envVarNames: { baseUrl: 'VITE_WORDPRESS_URL' } },
} }));

function Probe() {
  const { products, catalogLoading, catalogError, retryCatalog } = useStore();
  return <><span data-testid="count">{products.length}</span><span>{catalogLoading ? 'loading' : 'finished'}</span><span role="alert">{catalogError}</span><button onClick={retryCatalog}>Retry</button></>;
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('live context isolation', () => {
  it('does not display demo products on missing configuration', async () => {
    vi.stubEnv('VITE_WORDPRESS_URL', '');
    render(<MemoryRouter><StoreProvider><Probe /></StoreProvider></MemoryRouter>);
    await screen.findByText('finished');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByRole('alert')).toHaveTextContent('Missing public WordPress URL');
  });

  it('keeps live API failures visible without demo recovery', async () => {
    vi.stubEnv('VITE_WORDPRESS_URL', 'https://example.com');
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{"message":"Catalog unavailable"}', { status: 503 })));
    render(<MemoryRouter><StoreProvider><Probe /></StoreProvider></MemoryRouter>);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Catalog unavailable'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
