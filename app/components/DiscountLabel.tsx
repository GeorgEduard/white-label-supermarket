import React from 'react';
import useDiscount from '@/app/hooks/useDiscount';

export default function DiscountLabel({ discountID }: { discountID?: string }) {
  const { discount, loading, error } = useDiscount(discountID);

  return discount && !loading && !error ? (
    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-red-500 text-white px-2 py-1 rounded shadow-sm">
      {discount?.label}
    </span>
  ) : null;
}
