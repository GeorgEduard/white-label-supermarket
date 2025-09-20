import ProductItem from './ProductItem';
import type { Product } from '@/app/types';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <ul className="grid gap-4 sm:gap-6">
      {products.map(p => (
        <ProductItem key={p.code} product={p} />
      ))}
    </ul>
  );
}
