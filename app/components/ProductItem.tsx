import Image from 'next/image';
import type { Product } from '@/app/types';

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product: p }: ProductItemProps) {
  return (
    <li className="flex gap-4 sm:gap-6 items-center p-4 rounded-lg border border-emerald-100 bg-white/80 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-md ring-1 ring-emerald-100 bg-white shadow-inner">
        <Image src={p.image} alt={p.name} fill sizes="128px" className="object-contain" />
        {p.promo ? (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-amber-500 text-white px-2 py-1 rounded shadow-sm">
            {p.promo}
          </span>
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium truncate">{p.name}</h2>
          <div className="text-emerald-700 font-semibold">${p.price.toFixed(2)}</div>
        </div>
        <p className="text-sm text-black/70 mt-1 line-clamp-2">{p.description}</p>
        <div className="mt-3">
          <button className="inline-flex items-center justify-center rounded-md bg-amber-500 text-white px-3 py-1.5 text-sm shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition-colors duration-200">
            Add to cart
          </button>
        </div>
      </div>
    </li>
  );
}
