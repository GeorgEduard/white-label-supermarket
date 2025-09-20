import React from 'react';
import usePromotion from '@/app/hooks/usePromotion';

export default function PromotionLabel({ promoID }: { promoID?: string }) {
  const { promo, loading, error } = usePromotion(promoID);

  return promo && !loading && !error ? (
    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-red-500 text-white px-2 py-1 rounded shadow-sm">
      {promo?.label}
    </span>
  ) : null;
}
