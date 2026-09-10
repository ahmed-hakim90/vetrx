export interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
}

export interface ChargeRequest {
  amount: number;
  currency: string;
  method: 'card' | 'apple_pay' | 'cod' | 'tabby' | 'tamara';
  card?: CardDetails;
}

export type ChargeResult =
  | { status: 'succeeded'; providerReference: string }
  | { status: 'failed'; message: string };

// Real payment integrations (Stripe, PayTabs, Tap, etc.) implement this
// interface. Card data must never be persisted or logged by an
// implementation — it exists only for the duration of the charge call.
export interface PaymentProvider {
  readonly id: string;
  charge(request: ChargeRequest): Promise<ChargeResult>;
}
