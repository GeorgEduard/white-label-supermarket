'use client';
import React from 'react';
import { Product } from '@/app/types';
import { isOneFree, removeFromCart, updateQty } from '@/app/lib/cart';
import Button from '@/app/components/ui/Button';

interface CartItemProps {
  product: Product;
  qty: number;
}

export default function CartDetails({ product, qty }: CartItemProps) {
  return (
    <div className="mt-3 flex items-center gap-3">
      {/* Quantity */}
      <label className="text-sm text-black/70" htmlFor={`qty-${product.code}`}>
        Qty
      </label>
      <input
        id={`qty-${product.code}`}
        type="number"
        min={isOneFree(product) ? 2 : 1}
        step={isOneFree(product) ? 2 : 1}
        inputMode="numeric"
        className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
        value={qty}
        onChange={e => updateQty(product.code, Number(e.target.value) || 1)}
      />
      {/* Remove */}
      <Button
        aria-label="Remove from cart"
        variant="danger"
        size="sm"
        className="ml-auto"
        onClick={() => removeFromCart(product.code)}
      >
        <span aria-hidden>×</span>
      </Button>
    </div>
  );
}
