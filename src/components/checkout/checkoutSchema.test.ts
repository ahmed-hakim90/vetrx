import { describe, it, expect } from 'vitest';
import { checkoutFormSchema, checkoutFormSchemaEgypt } from './checkoutSchema';

const validGulf = {
  market: 'gulf' as const,
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '+971501234567',
  city: 'Dubai',
  addressLine: 'Downtown Boulevard, Building 4',
  deliveryNotes: '',
  deliveryMethod: 'express' as const,
  paymentMethod: 'cod' as const,
};

const validEgypt = {
  market: 'egypt' as const,
  fullName: 'Ahmed Mostafa',
  email: '',
  phone: '01012345678',
  governorateId: 'cairo',
  areaOrCity: 'Nasr City',
  streetName: 'Makram Ebeid Street',
  buildingNumber: '12',
  floorApartment: '3',
  landmark: '',
  deliveryNotes: '',
  deliveryMethod: 'standard' as const,
  paymentMethod: 'cod' as const,
};

describe('checkoutFormSchema (Gulf market)', () => {
  it('accepts a fully valid non-card submission', () => {
    const result = checkoutFormSchema.safeParse(validGulf);
    expect(result.success).toBe(true);
  });

  it('rejects a missing full name', () => {
    const result = checkoutFormSchema.safeParse({ ...validGulf, fullName: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = checkoutFormSchema.safeParse({ ...validGulf, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('does not require card fields when payment method is not "card"', () => {
    const result = checkoutFormSchema.safeParse({ ...validGulf, paymentMethod: 'cod' });
    expect(result.success).toBe(true);
  });

  it('requires valid card fields when payment method is "card"', () => {
    const withoutCard = checkoutFormSchema.safeParse({ ...validGulf, paymentMethod: 'card' });
    expect(withoutCard.success).toBe(false);

    const withCard = checkoutFormSchema.safeParse({
      ...validGulf,
      paymentMethod: 'card',
      cardNumber: '4242 4242 4242 4242',
      cardExpiry: '12/28',
      cardCvc: '123',
      cardName: 'Test User',
    });
    expect(withCard.success).toBe(true);
  });

  it('rejects a malformed card expiry', () => {
    const result = checkoutFormSchema.safeParse({
      ...validGulf,
      paymentMethod: 'card',
      cardNumber: '4242 4242 4242 4242',
      cardExpiry: '13/99',
      cardCvc: '123',
      cardName: 'Test User',
    });
    expect(result.success).toBe(false);
  });
});

describe('checkoutFormSchemaEgypt', () => {
  it('accepts a fully valid Egypt submission with no email', () => {
    const result = checkoutFormSchemaEgypt.safeParse(validEgypt);
    expect(result.success).toBe(true);
  });

  it.each(['01012345678', '01112345678', '01212345678', '01512345678', '+201012345678', '0020 101 234 5678'])(
    'accepts Egyptian mobile number %s',
    (phone) => {
      const result = checkoutFormSchemaEgypt.safeParse({ ...validEgypt, phone });
      expect(result.success).toBe(true);
    }
  );

  it.each(['0501234567', '123456', '01312345678'])('rejects invalid Egyptian mobile number %s', (phone) => {
    const result = checkoutFormSchemaEgypt.safeParse({ ...validEgypt, phone });
    expect(result.success).toBe(false);
  });

  it('rejects a missing governorate', () => {
    const result = checkoutFormSchemaEgypt.safeParse({ ...validEgypt, governorateId: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing building number', () => {
    const result = checkoutFormSchemaEgypt.safeParse({ ...validEgypt, buildingNumber: '' });
    expect(result.success).toBe(false);
  });

  it('allows floorApartment and landmark to be omitted', () => {
    const { floorApartment, landmark, ...rest } = validEgypt;
    const result = checkoutFormSchemaEgypt.safeParse(rest);
    expect(result.success).toBe(true);
  });
});
