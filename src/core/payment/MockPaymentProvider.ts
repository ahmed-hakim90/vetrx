import { ChargeRequest, ChargeResult, PaymentProvider } from './types';

// Development/demo-only payment provider. Simulates network latency and
// never contacts a real payment gateway — no card data leaves the browser,
// nothing is persisted, nothing is logged. Cash-on-delivery and other
// non-card methods always succeed since no charge is collected online.
export class MockPaymentProvider implements PaymentProvider {
  readonly id = 'mock';

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (request.method === 'cod') {
      return { status: 'succeeded', providerReference: `MOCK-COD-${Date.now()}` };
    }

    if (request.method === 'card' && request.card) {
      // Simulate the one deterministic failure case a developer would want
      // to test, without ever inspecting real card data.
      const lastDigit = request.card.cardNumber.replace(/\D/g, '').slice(-1);
      if (lastDigit === '0') {
        return { status: 'failed', message: 'Card declined by issuing bank (demo simulation).' };
      }
    }

    return { status: 'succeeded', providerReference: `MOCK-${Date.now()}` };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
