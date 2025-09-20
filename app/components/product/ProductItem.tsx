'use client';
import Image from 'next/image';
import type { CartItem } from '@/app/types';
import PromotionLabel from '@/app/components/PromotionLabel';
import CartDetails from '@/app/components/product/CartDetails';
import { addToCart } from '@/app/lib/cart';
import { useState } from 'react';

interface ProductItemProps extends CartItem {
  isInCart?: boolean;
}

export default function ProductItem({
  product: p,
  isInCart,
  qty,
}: ProductItemProps) {
  const [loading, setLoading] = useState(false);

  const addItemToCart = () => {
    setLoading(true);
    addToCart(p);
    setLoading(false);
  };

  const itemPrice = isInCart ? p.price * qty : p.price;

  return (
    <li className="flex gap-4 sm:gap-6 items-center p-4 rounded-lg border border-emerald-100 bg-white/80 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-md ring-1 ring-emerald-100 bg-white shadow-inner">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="128px"
          className="object-contain"
        />
        <PromotionLabel promoID={p.promo} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium truncate">{p.name}</h2>
          <div className="text-emerald-700 font-semibold">
            ${itemPrice.toFixed(2)}
          </div>
        </div>
        <p className="text-sm text-black/70 mt-1 line-clamp-2">
          {p.description}
        </p>
        {isInCart ? (
          <CartDetails product={p} qty={qty || 1} />
        ) : (
          <div className="mt-3">
            <button
              disabled={loading}
              onClick={addItemToCart}
              className="cursor-pointer inline-flex items-center justify-center rounded-md bg-cyan-700 text-white px-3 py-1.5 text-sm shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 transition-colors duration-200"
            >
              Add to cart
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
