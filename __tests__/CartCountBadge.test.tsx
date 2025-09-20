import React from 'react';
import { render, screen } from '@testing-library/react';
import CartCountBadge from '@/app/components/CartCountBadge';
import { setCart, clearCart } from '@/app/lib/cart';
import type { Product } from '@/app/types';

const productA: Product = {
  code: 'A',
  name: 'A',
  price: 1,
  description: 'A',
  image: '/a.svg',
};
const productB: Product = {
  code: 'B',
  name: 'B',
  price: 2,
  description: 'B',
  image: '/b.svg',
};

describe('CartCountBadge', () => {
  beforeEach(() => clearCart());

  it('renders the total qty when cart has items and hides when empty', async () => {
    // Prime the cart with items (total qty 3)
    setCart([
      { product: productA, qty: 1 },
      { product: productB, qty: 2 },
    ]);

    const { rerender } = render(React.createElement(CartCountBadge));

    expect(
      screen.getByLabelText(/3 items? in cart/i),
    ).toBeInTheDocument();

    // Clear cart and ensure it hides
    clearCart();

    // Rerender to reflect state changes in hook
    rerender(React.createElement(CartCountBadge));

    expect(screen.queryByLabelText(/items? in cart/i)).toBeNull();
  });
});
