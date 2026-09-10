import { ClientConfig } from '../../config/clients/schema';
import { Language } from '../../types/store';

type PaymentMethod = ClientConfig['paymentMethods'][number];

// Generic, market-neutral names for the payment method types the template
// understands. A provider-branded method (a buy-now-pay-later partner, a
// local wallet) must declare its own `label` in the client config that
// enables it — that keeps every provider's brand name out of shared code,
// so a client which doesn't offer that method never ships its name.
const GENERIC_LABELS: Record<string, { en: string; ar: string }> = {
  card: { en: 'Visa / Mastercard', ar: 'فيزا / ماستركارد' },
  apple_pay: { en: 'Apple Pay', ar: 'أبل باي' },
  cod: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
};

export function paymentMethodLabel(method: PaymentMethod, language: Language): string {
  if (method.label) return method.label[language];
  return GENERIC_LABELS[method.id]?.[language] ?? method.id;
}

export function paymentMethodDescription(method: PaymentMethod, language: Language): string | undefined {
  return method.description?.[language];
}

// For rendering an order's stored payment method id, where only the id was
// persisted: falls back to the generic label when the client config no
// longer lists that method.
export function paymentMethodLabelById(client: ClientConfig, id: string, language: Language): string {
  const method = client.paymentMethods.find((m) => m.id === id);
  if (method) return paymentMethodLabel(method, language);
  return GENERIC_LABELS[id]?.[language] ?? id;
}
