'use client';
import React, { useMemo } from 'react';
import type { CartItem } from '@/app/types';
import DiscountItem from '@/app/components/discounts/DiscountItem';
import CheckoutForm from '@/app/components/checkout/CheckoutForm';
import useCartDiscounts from '@/app/hooks/useCartDiscounts';
import { getCartPrice } from '@/app/lib/cart';

export default function OrderSummary({ items }: { items: CartItem[] }) {
  const { discounts, error, loading } = useCartDiscounts();

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + getCartPrice(it.product, it.qty), 0),
    [items],
  );

  const totalDiscount = useMemo(() => {
    if (!discounts || !discounts.length) {
      return 0;
    }
    return discounts.reduce((sum, d) => {
      if (subtotal >= d.threshold) {
        const value = d.type === 'fixed' ? d.value : (subtotal * d.value) / 100;
        return sum + value;
      }
      return sum;
    }, 0);
  }, [discounts, subtotal]);

  const total = useMemo(
    () => subtotal - totalDiscount,
    [subtotal, totalDiscount],
  );

  return (
    <section className="lg:col-span-1">
      <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Order Summary</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
        {error ? (
          <span className="text-red-600 whitespace-nowrap">
            Failed to fetch discounts
          </span>
        ) : loading ? (
          <div
            className="flex items-center gap-2 text-sm text-black/70"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span className="sr-only">Loading discounts…</span>
          </div>
        ) : discounts.length ? (
          discounts.map(discount => (
            <DiscountItem
              key={discount.id}
              discount={discount}
              subtotal={subtotal}
            />
          ))
        ) : null}
        <div className="flex justify-between text-sm mb-4">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-semibold text-emerald-700 mb-4">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <CheckoutForm items={items} total={total} />
      </div>
    </section>
  );
}
