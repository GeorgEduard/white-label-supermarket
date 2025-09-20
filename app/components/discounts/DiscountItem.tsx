import React, { useMemo } from 'react';
import { CartDiscount } from '@/app/types';
export default function DiscountItem({
  discount,
  subtotal,
}: {
  discount: CartDiscount;
  subtotal: number;
}) {
  const discountValue = useMemo(() => {
    return discount.type === 'fixed'
      ? discount.value
      : (subtotal * discount.value) / 100;
  }, [discount, subtotal]);

  if (discount.threshold > subtotal) {
    return null;
  }

  return (
    <div key={discount.id} className="flex justify-between text-sm mb-2">
      <div>
        <p>{discount.label}</p>
      </div>
      <span className="text-red-600 whitespace-nowrap">
        -{`£${discountValue.toFixed(2)}`}
      </span>
    </div>
  );
}
