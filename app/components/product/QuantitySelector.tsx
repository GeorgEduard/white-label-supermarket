'use client';
import React from 'react';
import { CartItem } from '@/app/types';
import { isOneFree, updateQty } from '@/app/lib/cart';

export default function QuantitySelector({ product, qty }: CartItem) {
  // Define additional logic for the buy-one-get-one rule.
  const oneFree = isOneFree(product);
  const stock = product.stock;
  const isStockOdd = oneFree && stock % 2 === 1;
  const minQty = oneFree ? (stock < 2 ? 1 : 2) : 1;
  const step = oneFree ? 2 : 1;
  const maxQty = stock;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const capped = Math.min(Math.max(value, minQty), maxQty || minQty); // Ensure values are within min/max

    if (oneFree) {
      // Special case: when stock is odd and currently at stock, a decrement should go to previous even
      if (isStockOdd && qty === stock && value < (stock || 0)) {
        updateQty(product.code, (stock || 0) - 1);
        return;
      }
      // Allow odd only at the stock cap; otherwise force even quantities
      if (capped >= (stock || 0)) {
        updateQty(product.code, stock);
        return;
      }
      const even = capped % 2 === 0 ? capped : capped - 1;
      const finalVal = Math.max(minQty, even);
      updateQty(product.code, finalVal);
      return;
    }

    updateQty(product.code, capped);
  };

  const noStockLeft = qty >= stock || (maxQty ?? 0) === 0;

  return (
    <div className="mt-3 flex items-center gap-3">
      {/* Quantity */}
      <label className="text-sm text-black/70" htmlFor={`qty-${product.code}`}>
        Qty
      </label>
      <input
        id={`qty-${product.code}`}
        type="number"
        min={minQty}
        max={product.stock}
        step={step}
        inputMode="numeric"
        className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
        value={qty}
        onChange={handleChange}
      />
      {noStockLeft && (
        <span className="text-xs text-red-600" role="status">
          No more units available in stock
        </span>
      )}
      {oneFree && isStockOdd && qty === stock && stock > 0 && (
        <span className="text-xs text-amber-600" role="status">
          We’re sorry, we only have {stock} items, so we won’t be able to give
          you one extra product for free.
        </span>
      )}
    </div>
  );
}
