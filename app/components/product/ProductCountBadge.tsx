'use client';
import React, { useMemo } from 'react';
import useCart from '@/app/hooks/useCart';

export default function ProductCountBadge({ code }: { code: string }) {
  const items = useCart();

  const count = useMemo(() => {
    const item = items.find(i => i.product.code === code);
    return item?.qty || 0;
  }, [items, code]);

  if (count <= 0) {
    return null;
  }

  return (
    <span
      aria-label={`${count} item${count === 1 ? '' : 's'} of this product in cart`}
      className="absolute top-1 right-1 h-5 min-w-5 px-1.5 inline-flex items-center justify-center rounded-full bg-white text-emerald-700 text-xs font-semibold shadow-sm"
    >
      {count}
    </span>
  );
}
