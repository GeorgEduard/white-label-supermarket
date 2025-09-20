'use client';
import React, { useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/app/types';
import { getCart, getCartPrice } from '@/app/lib/cart';
import useCartDiscounts from '@/app/hooks/useCartDiscounts';
import CartSection from '@/app/components/checkout/CartSection';
import OrderSummary from '@/app/components/checkout/OrderSummary';

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { discounts, error, loading } = useCartDiscounts();

  useEffect(() => {
    const load = () => setItems(getCart());
    // Load cart from sessionStorage on mount
    load();

    const handler = (e: Event) => {
      try {
        const cartEvent = e as CustomEvent<{ items?: CartItem[] }>;
        const items = cartEvent.detail?.items;
        if (Array.isArray(items)) {
          setItems(items as CartItem[]);
        } else {
          load();
        }
      } catch {
        load();
      }
    };

    window.addEventListener('cart:updated', handler as EventListener);
    return () =>
      window.removeEventListener('cart:updated', handler as EventListener);
  }, []);

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
    <div className="mx-auto max-w-5xl py-4 sm:py-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="rounded-lg bg-emerald-50/60 px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CartSection items={items} />
          <OrderSummary
            items={items}
            subtotal={subtotal}
            total={total}
            discounts={discounts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
