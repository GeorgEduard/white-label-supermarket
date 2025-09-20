import React from 'react';
import { render, screen } from '@testing-library/react';
import DiscountItem from '@/app/components/discounts/DiscountItem';
import type { CartDiscount } from '@/app/types';

const percentageDiscount: CartDiscount = {
  id: 'D1',
  type: 'percentage',
  scope: 'cart',
  value: 20,
  threshold: 10,
  isActive: true,
  label: '20% off for orders over £10',
};

const fixedDiscount: CartDiscount = {
  id: 'D2',
  type: 'fixed',
  scope: 'cart',
  value: 5,
  threshold: 20,
  isActive: true,
  label: 'Save £5 over £20',
};

describe('DiscountItem', () => {
  it('does not render when subtotal is below threshold', () => {
    const { container } = render(
      React.createElement(DiscountItem, { discount: percentageDiscount, subtotal: 5 }),
    );
    // returns null
    expect(container).toBeEmptyDOMElement();
  });

  it('renders percentage discount value when applicable', () => {
    render(
      React.createElement(DiscountItem, { discount: percentageDiscount, subtotal: 20 }),
    );
    expect(screen.getByText(/20% off/i)).toBeInTheDocument();
    // 20% of 20 => £4.00
    expect(screen.getByText('-£4.00')).toBeInTheDocument();
  });

  it('renders fixed discount value when applicable', () => {
    render(
      React.createElement(DiscountItem, { discount: fixedDiscount, subtotal: 25 }),
    );
    expect(screen.getByText(/Save £5/i)).toBeInTheDocument();
    expect(screen.getByText('-£5.00')).toBeInTheDocument();
  });
});
