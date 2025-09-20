'use client';
import React, { useMemo } from 'react';
import useCart from '@/app/hooks/useCart';

export default function CartCountBadge() {
  const items = useCart();

  const count = useMemo(
    () => items.reduce((sum, it) => sum + (it.qty || 0), 0),
    [items],
  );

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
