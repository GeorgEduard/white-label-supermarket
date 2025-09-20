import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/app/types';

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to load products: ${res.status}`);
      }

      const data = (await res.json()) as Product[];

      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error };
}
