import { ClientConfig } from '../../config/clients/schema';

// Pre-launch checks a real deployment must resolve. This module never
// blocks the build itself (so `npm run build:<client>` stays usable for
// staging/testing a client that isn't launch-ready yet) — it only surfaces
// what's still missing. Wire `getProductionReadinessIssues` into a stricter,
// separate CI gate for an actual production launch pipeline.
export function getProductionReadinessIssues(client: ClientConfig): string[] {
  const issues: string[] = [];

  if (!client.contact.supportPhone && !client.contact.supportEmail) {
    issues.push('No support phone or email configured (client.contact).');
  }
  if (client.contact.supportEmail && client.contact.supportEmailStatus === 'needs-confirmation') {
    issues.push('contact.supportEmail is on record but has not been re-confirmed with the business.');
  }
  if (client.addresses.length === 0) {
    issues.push('No physical address configured (client.addresses).');
  }
  for (const address of client.addresses) {
    if (address.status === 'needs-confirmation') {
      issues.push(`Address "${address.label.en}" has not been confirmed by the business.`);
    }
  }

  // Money: a store cannot honestly take an order until it knows what it
  // charges for delivery, whether it charges tax, and how it gets paid.
  if (client.shipping.standardFee === undefined) {
    issues.push('No standard shipping fee configured (client.shipping.standardFee).');
  }
  if (client.shipping.zones.length === 0) {
    issues.push('No delivery zones configured — the served areas are still unknown (client.shipping.zones).');
  }
  if (!client.shipping.etaConfirmed) {
    issues.push('No confirmed delivery-time commitment (client.shipping.etaConfirmed is false).');
  }
  if (!client.tax.vatApplied) {
    issues.push('Tax handling is unresolved: tax.vatApplied is false, so no VAT is charged or shown.');
  }

  const offeredMethods = client.paymentMethods.filter((m) => m.enabled);
  if (offeredMethods.length === 0) {
    issues.push('No payment method is offered at checkout (client.paymentMethods).');
  }
  for (const method of offeredMethods) {
    if (!method.confirmed) {
      issues.push(`Payment method "${method.id}" is offered but not confirmed by the business.`);
    }
  }
  if (!client.policies.returnPolicy) {
    issues.push('No return policy text configured (client.policies.returnPolicy).');
  }
  if (!client.policies.warrantyPolicy) {
    issues.push('No warranty policy text configured (client.policies.warrantyPolicy).');
  }

  const mandatoryDocs: Array<[string, typeof client.content.privacyPolicy]> = [
    ['privacyPolicy', client.content.privacyPolicy],
    ['termsOfService', client.content.termsOfService],
  ];
  for (const [key, doc] of mandatoryDocs) {
    if (!doc) {
      issues.push(`content.${key} is not set at all.`);
    } else if (doc.status === 'draft') {
      issues.push(`content.${key} is still a draft — needs legal review before launch.`);
    }
  }

  if (client.commerce.provider === 'mock') {
    issues.push('Commerce provider is still "mock" — no real product/order backend connected.');
  }

  return issues;
}

export function logProductionReadiness(client: ClientConfig): void {
  if (typeof window === 'undefined') return;
  const issues = getProductionReadinessIssues(client);
  if (issues.length === 0) return;
  console.warn(
    `[${client.id}] Not production-ready yet (${issues.length} item(s)). ` +
      `See docs/SHAMS-LAUNCH-CHECKLIST.md or the client's own launch checklist:\n` +
      issues.map((i) => `  - ${i}`).join('\n')
  );
}
