import { useCallback, useEffect, useState } from 'react';
import type { Discount } from '@/app/types';

/**
 * Custom hook to fetch a discount by ID
 */
export default function useDiscount(id?: string) {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscount = useCallback(async () => {
    if (!id) {
      setError('Discount ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/discounts/${encodeURIComponent(id)}`, {
        cache: 'no-store',
      });
      // 404 is a valid response for a discount not found, and not an error
      if (res.status === 404) {
        setDiscount(null);
        setError('Discount not found');
      } else if (!res.ok) {
        throw new Error(`Failed to load discount: ${res.status}`);
      } else {
        const data = (await res.json()) as Discount;
        setDiscount(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDiscount();
  }, [fetchDiscount]);

  return { discount, loading, error } as const;
}
