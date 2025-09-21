import { useCallback, useEffect, useState } from 'react';
import type { CartDiscount, Discount } from '@/app/types';

/**
 * Custom hook to fetch cart-scoped discounts
 */
export default function useCartDiscounts() {
  const [discounts, setDiscounts] = useState<CartDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/discounts', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load discounts: ${res.status}`);
      }
      const data = (await res.json()) as Discount[];
      // Get only active cart-scoped discounts
      const activeCartDiscounts = data
        .filter(isCartDiscount)
        .filter(d => d.isActive);
      setDiscounts(activeCartDiscounts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDiscounts();
  }, [fetchDiscounts]);

  return { discounts, loading, error } as const;
}

function isCartDiscount(d: Discount): d is CartDiscount {
  return d.scope === 'cart' && (d as CartDiscount).isActive;
}
