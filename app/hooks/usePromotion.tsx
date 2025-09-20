import { useCallback, useEffect, useState } from 'react';
import type { Promo } from '@/app/types';

export default function usePromotion(id?: string) {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotion = useCallback(async () => {
    if (!id) {
      setError('Promotion ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/promotions/${encodeURIComponent(id)}`, {
        cache: 'no-store',
      });

      if (res.status === 404) {
        setPromo(null);
        setError('Promotion not found');
      } else if (!res.ok) {
        throw new Error(`Failed to load promotion: ${res.status}`);
      } else {
        const data = (await res.json()) as Promo;
        setPromo(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchPromotion();
  }, [fetchPromotion]);

  return { promo, loading, error } as const;
}
