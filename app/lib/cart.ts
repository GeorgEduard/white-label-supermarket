import type { CartItem, Product } from '@/app/types';
import { discounts } from '@/app/api/discounts/discounts';

const KEY = 'cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const data = sessionStorage.getItem(KEY);
    if (!data) return [];
    const cart = JSON.parse(data);
    // Ensure the parsed value is an array
    if (Array.isArray(cart)) {
      return cart.map((i: CartItem) => {
        const qty = i?.qty ?? 1;
        const product = i?.product as Product;
        if (!product) return i;
        const adjustedQty = clampToStock(
          product,
          adjustQtyForDiscount(product, qty),
        );
        return { ...i, qty: adjustedQty };
      });
    }
    return [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(items));
    // notify listeners in the same tab
    try {
      window.dispatchEvent(
        new CustomEvent('cart:updated', { detail: { items } }),
      );
    } catch {
      // ignore event dispatch errors
    }
  } catch {
    // ignore storage errors
  }
}

export function isOneFree(product?: Product) {
  if (!product?.discount) {
    return false;
  }
  const discount = discounts.find(p => p.id === product.discount);
  return discount?.type === 'one-free';
}

export function getPayableUnits(product: Product, qty: number) {
  const normalizedQty = Math.max(0, Math.floor(qty || 0));
  if (isOneFree(product)) {
    // Every second item is free; payable units are ceil(qty / 2)
    return Math.ceil(normalizedQty / 2);
  }
  return normalizedQty;
}

export function getCartPrice(product: Product, qty: number) {
  return product.price * getPayableUnits(product, qty);
}

function adjustQtyForDiscount(product: Product, qty: number) {
  const baseQty = Math.max(1, Math.floor(qty || 1));
  if (!isOneFree(product)) {
    return baseQty;
  }
  // For one-free, enforce minimum quantity but do not force even quantities
  const atLeastMin = Math.max(2, baseQty);
  return atLeastMin;
}

function clampToStock(product: Product, qty: number) {
  const stock = product.stock ?? 0;
  if (stock <= 0) {
    return 0;
  }
  const requested = Math.max(0, Math.floor(qty || 0));
  if (!isOneFree(product)) {
    return Math.min(requested, stock);
  }
  // One-free: allow odd ONLY at stock cap; otherwise enforce even quantities with min
  const min = stock < 2 ? 1 : 2;
  if (requested >= stock) {
    return stock;
  }
  const desired = Math.max(min, requested);
  const evenDesired = desired % 2 === 0 ? desired : desired - 1;
  return Math.min(evenDesired, stock);
}

export function addToCart(product: Product, qty = 1) {
  const items = getCart();
  const index = items.findIndex(i => i.product.code === product.code);

  // Prevent adding when there's no stock
  if ((product.stock ?? 0) <= 0) {
    return items;
  }

  // For one-free, adding a single should add 2; generally enforce even increments and min 2
  const increment = adjustQtyForDiscount(product, qty);

  if (index >= 0) {
    const current = items[index];
    const nextQtyRaw = (current.qty || 0) + increment;
    const nextQty = clampToStock(
      product,
      adjustQtyForDiscount(product, nextQtyRaw),
    );
    items[index] = { ...current, qty: nextQty };
  } else {
    const initial = clampToStock(product, increment);
    if (initial > 0) {
      items.push({ product, qty: initial });
    }
  }
  setCart(items);
  return items;
}

export function updateQty(code: string, qty: number) {
  const items = getCart();
  const updated = items.map(i => {
    if (i.product.code !== code) return i;
    const adjusted = clampToStock(
      i.product,
      adjustQtyForDiscount(i.product, qty),
    );
    return { ...i, qty: adjusted };
  });
  setCart(updated);
  return updated;
}

export function removeFromCart(code: string) {
  const items = getCart().filter(i => i.product.code !== code);
  setCart(items);
  return items;
}

export function clearCart() {
  setCart([]);
}
