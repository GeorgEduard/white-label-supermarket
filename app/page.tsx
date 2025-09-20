'use client';

import ProductList from './components/ProductList';
import { useContext } from 'react';
import { ProductContext } from '@/app/context/ProductProvider';

export default function Home() {
  const { products, loading, error } = useContext(ProductContext);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Featured Products</h1>
      {loading ? (
        <div className="text-sm text-black/60">Loading products…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
