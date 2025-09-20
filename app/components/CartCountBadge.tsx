'use client';
import React, { useEffect, useState } from 'react';
import { getCart } from '@/app/lib/cart';

export default function CartCountBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initialize from sessionStorage
    const load = () => {
      const items = getCart();
      const total = items.reduce((sum, it) => sum + (it.qty || 0), 0);
      setCount(total);
    };
    load();

    const handler = (e: Event) => {
      try {
        const cartEvent = e as CustomEvent<{ items?: { qty: number }[] }>;
        const items = cartEvent.detail?.items;
        if (Array.isArray(items)) {
          const total = items.reduce((sum, item) => sum + (item.qty || 0), 0);
          setCount(total);
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

  if (count <= 0) {
    return null;
  }

  return (
    <span
      aria-label={`${count} item${count === 1 ? '' : 's'} in cart`}
      className="ml-1 h-5 w-5 inline-flex items-center justify-center rounded-full bg-white text-emerald-700 text-xs font-semibold px-2 py-0.5"
    >
      {count}
    </span>
  );
}
