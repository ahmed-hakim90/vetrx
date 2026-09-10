import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from '../../context/StoreContext';
import { ContactPage } from './ContactPage';

function renderContactPage() {
  return render(
    <MemoryRouter initialEntries={['/contact']}>
      <StoreProvider>
        <ContactPage />
      </StoreProvider>
    </MemoryRouter>
  );
}

// Runs against the active client, which vitest.config.ts pins to Shams.
describe('ContactPage (Shams Stores)', () => {
  it('shows every confirmed phone number in its local display format', () => {
    renderContactPage();

    expect(screen.getAllByText('02 2390 1870').length).toBeGreaterThan(0);
    expect(screen.getAllByText('02 2390 1860').length).toBeGreaterThan(0);
    expect(screen.getAllByText('010 1133 1666').length).toBeGreaterThan(0);
  });

  it('makes phone numbers dialable with the E.164 form', () => {
    renderContactPage();
    const link = screen.getAllByText('02 2390 1870')[0];
    expect(link.getAttribute('href')).toBe('tel:+20223901870');
  });

  it('shows the support email as a mailto link', () => {
    renderContactPage();
    const email = screen.getByText('info@shams-stores.com');
    expect(email.getAttribute('href')).toBe('mailto:info@shams-stores.com');
  });

  it('lists both branches with their own street addresses and numbers', () => {
    renderContactPage();

    expect(screen.getByText('Downtown Branch')).toBeInTheDocument();
    expect(screen.getByText(/5 Sherif Street/)).toBeInTheDocument();

    expect(screen.getByText('Heliopolis Branch')).toBeInTheDocument();
    expect(screen.getByText(/Omar Ibn El-Khattab Street/)).toBeInTheDocument();
    expect(screen.getAllByText('02 2633 7800').length).toBeGreaterThan(0);
  });

  it('does not invent a WhatsApp number that was never provided', () => {
    renderContactPage();
    expect(screen.queryByText(/whatsapp/i)).toBeNull();
  });
});
