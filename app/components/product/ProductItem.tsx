'use client';
import Image from 'next/image';
import type { CartItem } from '@/app/types';
import DiscountLabel from '@/app/components/discounts/DiscountLabel';
import QuantitySelector from '@/app/components/product/QuantitySelector';
import { addToCart, getCartPrice, removeFromCart } from '@/app/lib/cart';
import React, { useMemo, useState } from 'react';
import Button from '@/app/components/ui/Button';
import ProductCountBadge from '@/app/components/product/ProductCountBadge';
import useCart from '@/app/hooks/useCart';

interface ProductItemProps extends CartItem {
  isInCart?: boolean;
}

export default function ProductItem({
  product: p,
  qty,
  isInCart,
}: ProductItemProps) {
  const [loading, setLoading] = useState(false);
  const items = useCart();

  const inCartQty = useMemo(() => {
    const found = items.find(i => i.product.code === p.code);
    return found?.qty || 0;
  }, [items, p.code]);

  const stock = p.stock ?? 0;
  const reachedCap = stock > 0 && inCartQty >= stock; // If reached stock cap, don't allow adding more

  const addItemToCart = () => {
    setLoading(true);
    addToCart(p);
    setLoading(false);
  };

  const itemPrice = isInCart ? getCartPrice(p, qty) : p.price;
  const outOfStock = stock <= 0 || reachedCap;

  return (
    <li className="flex gap-4 sm:gap-6 items-center p-4 rounded-lg border border-emerald-100 bg-white/80 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0  rounded-md ring-1 ring-emerald-100 bg-white shadow-inner">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="128px"
          className="object-contain"
        />
        <DiscountLabel discountID={p.discount} />
        {!isInCart && <ProductCountBadge code={p.code} />}
        {outOfStock && (
          <span className="absolute top-0 -translate-y-1/2 left-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium truncate">{p.name}</h2>
          <div className="text-right">
            <div className="text-emerald-700 font-semibold pr-2.5">
              £{itemPrice.toFixed(2)}
            </div>
            <Button
              aria-label="Remove from cart"
              variant="danger"
              size="sm"
              className="ml-auto"
              onClick={() => removeFromCart(p.code)}
            >
              <span aria-hidden>Remove from cart</span>
            </Button>
          </div>
        </div>
        <p className="text-sm text-black/70 mt-1 line-clamp-2">
          {p.description}
        </p>
        {isInCart ? (
          <QuantitySelector product={p} qty={qty || 1} />
        ) : (
          <div className="mt-3">
            <Button
              variant="primary"
              size="sm"
              disabled={loading || outOfStock}
              onClick={addItemToCart}
            >
              {outOfStock ? 'Unavailable' : 'Add to cart'}
            </Button>
            {!isInCart && reachedCap && (
              <div className="mt-2 text-xs text-red-600" role="status">
                No more units available in stock
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
