import { KeyboardEvent } from 'react';

// Props to spread onto a <div> that acts as a whole clickable "card"
// (e.g. a product card containing its own nested buttons, so the card
// itself cannot be a native <button>). Makes the card keyboard-operable
// and announced correctly to assistive tech.
export function activatableCardProps(onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    },
  };
}
