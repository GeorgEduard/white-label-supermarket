'use client';

import React, { createContext } from 'react';
import type { Product } from '@/app/types';
import useProducts from '@/app/hooks/useProducts';

type ProductContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  loading: true,
  error: null,
});

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { products, loading, error } = useProducts();

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}
