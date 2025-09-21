'use client';
import React from 'react';
import CartSection from '@/app/components/checkout/CartSection';
import OrderSummary from '@/app/components/checkout/OrderSummary';
import useCart from '@/app/hooks/useCart';

export default function CheckoutPage() {
  const items = useCart();

  return (
    <div className="mx-auto max-w-5xl py-4 sm:py-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="rounded-lg bg-emerald-50/60 px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CartSection items={items} />
          <OrderSummary items={items} />
        </div>
      </div>
    </div>
  );
}
