import type { CartItem, Product } from '@/app/types';

const KEY = 'cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = sessionStorage.getItem(KEY);
    if (!data) return [];
    const cart = JSON.parse(data);
    // Ensure the parsed value is an array
    if (Array.isArray(cart)) {
      return cart;
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

export function addToCart(product: Product, qty = 1) {
  const items = getCart();
  const index = items.findIndex(i => i.product.code === product.code);
  if (index >= 0) {
    items[index] = { ...items[index], qty: items[index].qty + qty };
  } else {
    items.push({ product, qty });
  }
  setCart(items);
  return items;
}

export function updateQty(code: string, qty: number) {
  const nextQty = Math.max(1, Math.floor(qty || 1));
  const items = getCart().map(i =>
    i.product.code === code ? { ...i, qty: nextQty } : i,
  );
  setCart(items);
  return items;
}

export function removeFromCart(code: string) {
  const items = getCart().filter(i => i.product.code !== code);
  setCart(items);
  return items;
}

export function clearCart() {
  setCart([]);
}
