'use client';
import Image from 'next/image';
import type { CartItem } from '@/app/types';
import DiscountLabel from '@/app/components/discounts/DiscountLabel';
import CartDetails from '@/app/components/product/CartDetails';
import { addToCart, getCartPrice } from '@/app/lib/cart';
import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import ProductCountBadge from '@/app/components/product/ProductCountBadge';

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

  const itemPrice = isInCart ? getCartPrice(p, qty) : p.price;

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
        <DiscountLabel discountID={p.discount} />
        {!isInCart && <ProductCountBadge code={p.code} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium truncate">{p.name}</h2>
          <div className="text-emerald-700 font-semibold">
            £{itemPrice.toFixed(2)}
          </div>
        </div>
        <p className="text-sm text-black/70 mt-1 line-clamp-2">
          {p.description}
        </p>
        {isInCart ? (
          <CartDetails product={p} qty={qty || 1} />
        ) : (
          <div className="mt-3">
            <Button
              variant="primary"
              size="sm"
              disabled={loading}
              onClick={addItemToCart}
            >
              Add to cart
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
