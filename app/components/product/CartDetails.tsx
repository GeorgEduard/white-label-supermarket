'use client';
import React from 'react';
import { Product } from '@/app/types';
import { removeFromCart, updateQty } from '@/app/lib/cart';

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
        min={1}
        inputMode="numeric"
        className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
        value={qty}
        onChange={e => updateQty(product.code, Number(e.target.value) || 1)}
      />
      {/* Remove */}
      <button
        aria-label="Remove from cart"
        className="ml-auto inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
        onClick={() => removeFromCart(product.code)}
      >
        <span aria-hidden>×</span>
      </button>
    </div>
  );
}
