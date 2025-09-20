"use client";
import React from 'react';
import type { CartItem } from '@/app/types';
import ProductItem from '@/app/components/product/ProductItem';
import Button from '@/app/components/ui/Button';
import { clearCart } from '@/app/lib/cart';

interface CartSectionProps {
  items: CartItem[];
}

export default function CartSection({ items }: CartSectionProps) {
  return (
    <section className="lg:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium mb-3">Your Cart</h2>
        <Button aria-label="Remove from cart" variant="danger" size="sm" onClick={clearCart}>
          Clear cart
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-black/70">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {items.map(({ product, qty }) => (
            <ProductItem isInCart key={product.code} product={product} qty={qty} />
          ))}
        </ul>
      )}
    </section>
  );
}
