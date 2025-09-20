'use client';
import React, { useEffect, useState } from 'react';
import { getCart } from '@/app/lib/cart';

export default function ProductCountBadge({ code }: { code: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => {
      const items = getCart();
      const item = items.find(i => i.product.code === code);
      setCount(item?.qty || 0);
    };

    load();

    const handler = (e: Event) => {
      try {
        const cartEvent = e as CustomEvent<{
          items?: { product: { code: string }; qty: number }[];
        }>;
        const items = cartEvent.detail?.items;
        if (Array.isArray(items)) {
          const found = items.find(i => i.product.code === code);
          setCount(found?.qty || 0);
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
  }, [code]);

  if (count <= 0) return null;

  return (
    <span
      aria-label={`${count} item${count === 1 ? '' : 's'} of this product in cart`}
      className="absolute top-1 right-1 h-5 min-w-5 px-1.5 inline-flex items-center justify-center rounded-full bg-white text-emerald-700 text-xs font-semibold shadow-sm"
    >
      {count}
    </span>
  );
}
