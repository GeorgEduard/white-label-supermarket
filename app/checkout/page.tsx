'use client';
import React, { useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/app/types';
import ProductItem from '@/app/components/product/ProductItem';
import CheckoutForm from '@/app/components/checkout/CheckoutForm';
import { clearCart, getCart, getCartPrice } from '@/app/lib/cart';
import useCartDiscounts from '@/app/hooks/useCartDiscounts';
import DiscountItem from '@/app/components/discounts/DiscountItem';

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
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium mb-3">Your Cart</h2>
            <button
              aria-label="Remove from cart"
              className="ml-auto inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={clearCart}
            >
              Clear cart
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-black/70">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <ProductItem
                  isInCart
                  key={product.code}
                  product={product}
                  qty={qty}
                />
              ))}
            </ul>
          )}
        </section>
        {/* Summary + Checkout */}
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
      </div>
    </div>
  );
}
