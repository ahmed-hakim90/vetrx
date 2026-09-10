import { z } from 'zod';

// Egyptian mobile numbers: 11 digits starting 010/011/012/015, optionally
// written with a leading +20 or 0020 country code / spaces / dashes.
const EGYPT_PHONE_REGEX = /^(?:\+20|0020|0)?1[0125]\d{8}$/;

function normalizeDigits(value: string): string {
  return value.replace(/[\s-]/g, '');
}

const cardFieldsSchema = z.object({
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),
});

function withCardSuperRefine<T extends { paymentMethod: string; cardNumber?: string; cardExpiry?: string; cardCvc?: string; cardName?: string }>(
  data: T,
  ctx: z.RefinementCtx
) {
  if (data.paymentMethod !== 'card') return;

  if (!/^[\d\s]{13,19}$/.test((data.cardNumber ?? '').trim())) {
    ctx.addIssue({ code: 'custom', path: ['cardNumber'], message: 'checkoutErrorCardNumber' });
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test((data.cardExpiry ?? '').trim())) {
    ctx.addIssue({ code: 'custom', path: ['cardExpiry'], message: 'checkoutErrorCardExpiry' });
  }
  if (!/^\d{3,4}$/.test((data.cardCvc ?? '').trim())) {
    ctx.addIssue({ code: 'custom', path: ['cardCvc'], message: 'checkoutErrorCardCvc' });
  }
  if ((data.cardName ?? '').trim().length < 2) {
    ctx.addIssue({ code: 'custom', path: ['cardName'], message: 'checkoutErrorCardName' });
  }
}

// Gulf-market address form (voltix / apex / lumina): country/city/free-text
// street address — unchanged from the original template shape.
export const checkoutFormSchemaGulf = z
  .object({
    market: z.literal('gulf'),
    fullName: z.string().trim().min(2, 'checkoutErrorFullName'),
    email: z.string().trim().email('checkoutErrorEmail'),
    phone: z.string().trim().min(7, 'checkoutErrorPhone'),
    city: z.string().trim().min(1, 'checkoutErrorCity'),
    addressLine: z.string().trim().min(5, 'checkoutErrorAddress'),
    deliveryNotes: z.string().trim().optional(),
    deliveryMethod: z.enum(['standard', 'express', 'same-day', 'pickup']),
    paymentMethod: z.enum(['card', 'apple_pay', 'cod', 'tabby', 'tamara']),
  })
  .merge(cardFieldsSchema)
  .superRefine(withCardSuperRefine);

// Egypt-market address form: governorate + granular street address, and an
// Egyptian mobile number instead of a generic phone string. Email is
// optional — no backend requires it for delivery today.
export const checkoutFormSchemaEgypt = z
  .object({
    market: z.literal('egypt'),
    fullName: z.string().trim().min(2, 'checkoutErrorFullName'),
    email: z.union([z.string().trim().email('checkoutErrorEmail'), z.literal('')]).optional(),
    phone: z
      .string()
      .trim()
      .min(1, 'checkoutErrorPhoneEgypt')
      .refine((v) => EGYPT_PHONE_REGEX.test(normalizeDigits(v)), 'checkoutErrorPhoneEgypt'),
    governorateId: z.string().trim().min(1, 'checkoutErrorGovernorate'),
    areaOrCity: z.string().trim().min(1, 'checkoutErrorCity'),
    streetName: z.string().trim().min(3, 'checkoutErrorStreetName'),
    buildingNumber: z.string().trim().min(1, 'checkoutErrorBuildingNumber'),
    floorApartment: z.string().trim().optional(),
    landmark: z.string().trim().optional(),
    deliveryNotes: z.string().trim().optional(),
    deliveryMethod: z.enum(['standard', 'express', 'same-day', 'pickup']),
    paymentMethod: z.enum(['card', 'apple_pay', 'cod', 'tabby', 'tamara']),
  })
  .merge(cardFieldsSchema)
  .superRefine(withCardSuperRefine);

export const checkoutFormSchema = z.discriminatedUnion('market', [
  checkoutFormSchemaGulf,
  checkoutFormSchemaEgypt,
]);

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type CheckoutFormValuesGulf = z.infer<typeof checkoutFormSchemaGulf>;
export type CheckoutFormValuesEgypt = z.infer<typeof checkoutFormSchemaEgypt>;
