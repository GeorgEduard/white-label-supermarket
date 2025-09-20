import type { CartItem, Product } from '@/app/types';
import { promotions } from '@/app/api/promotions/promotions';

const KEY = 'cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
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
        const adjustedQty = adjustQtyForPromo(product, qty);
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
  if (!product?.promo) {
    return false;
  }
  const promo = promotions.find(p => p.id === product.promo);
  return promo?.type === 'one-free';
}

export function getPayableUnits(product: Product, qty: number) {
  const adjustedQty = adjustQtyForPromo(product, qty);
  if (isOneFree(product)) {
    // Every second item is free; payable units are qty / 2
    return Math.floor(adjustedQty / 2);
  }
  return adjustedQty;
}

export function getCartPrice(product: Product, qty: number) {
  return product.price * getPayableUnits(product, qty);
}

function adjustQtyForPromo(product: Product, qty: number) {
  const baseQty = Math.max(1, Math.floor(qty || 1));
  if (!isOneFree(product)) {
    return baseQty;
  }
  // For one-free, the minimum is 2 and the quantity should be even
  const atLeastMin = Math.max(2, baseQty);
  return atLeastMin % 2 === 0 ? atLeastMin : atLeastMin + 1;
}

export function addToCart(product: Product, qty = 1) {
  const items = getCart();
  const index = items.findIndex(i => i.product.code === product.code);

  // For one-free, adding a single should add 2; generally enforce even increments and min 2
  const increment = adjustQtyForPromo(product, qty);

  if (index >= 0) {
    const current = items[index];
    const nextQtyRaw = (current.qty || 0) + increment;
    const nextQty = adjustQtyForPromo(product, nextQtyRaw);
    items[index] = { ...current, qty: nextQty };
  } else {
    items.push({ product, qty: increment });
  }
  setCart(items);
  return items;
}

export function updateQty(code: string, qty: number) {
  const items = getCart();
  const updated = items.map(i => {
    if (i.product.code !== code) return i;
    const adjusted = adjustQtyForPromo(i.product, qty);
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
