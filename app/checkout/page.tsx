'use client';
import { useEffect, useMemo, useState } from 'react';
import type { CartItem } from '@/app/types';
import ProductItem from '@/app/components/product/ProductItem';
import CheckoutForm from '@/app/components/checkout/CheckoutForm';
import { getCart } from '@/app/lib/cart';

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const cartTotal = useMemo(
    () => items.reduce((sum, it) => sum + it.product.price * it.qty, 0),
    [items],
  );

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-medium mb-3">Your Cart</h2>

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
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700 mb-4">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <CheckoutForm items={items} total={cartTotal} />
          </div>
        </section>
      </div>
    </div>
  );
}
