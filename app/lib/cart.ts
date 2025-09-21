import type { CartItem, Product } from '@/app/types';
import { discounts } from '@/app/api/discounts/discounts';

const SESSION_STORAGE_KEY = 'cart';

/**
 * Get the cart items from the session storage
 */
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) {
      return [];
    }
    const cart = JSON.parse(data);
    // Ensure the parsed value is an array
    if (Array.isArray(cart)) {
      return cart.map((i: CartItem) => {
        const qty = i?.qty ?? 1;
        const product = i?.product as Product;
        if (!product) {
          return i;
        }
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

/**
 * Set the cart items in the session storage
 */
export function setCart(items: CartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(items));
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

/**
 * Checks if the product has a `buy-one-get-one` discount
 */
export function isOneFree(product?: Product) {
  if (!product?.discount) {
    return false;
  }
  const discount = discounts.find(p => p.id === product.discount);
  return discount?.type === 'one-free';
}

/**
 * Returns the number of units that can be paid for the given quantity.
 */
export function getPayableUnits(product: Product, qty: number) {
  const normalizedQty = Math.max(0, Math.floor(qty || 0));
  if (isOneFree(product)) {
    // Every second item is free; payable units are ceil(qty / 2)
    return Math.ceil(normalizedQty / 2);
  }
  return normalizedQty;
}

/**
 * Returns the total price for the given product and quantity.
 */
export function getCartPrice(product: Product, qty: number) {
  return product.price * getPayableUnits(product, qty);
}

/**
 * Adjusts the requested quantity for a discount.
 */
function adjustQtyForDiscount(product: Product, qty: number) {
  const baseQty = Math.max(1, Math.floor(qty || 1));
  if (!isOneFree(product)) {
    return baseQty;
  }
  // For one-free, enforce minimum quantity but do not force even quantities
  return Math.max(2, baseQty);
}

/**
 * Clamps the requested quantity to the available stock for the product.
 */
function clampToStock(product: Product, qty: number) {
  const stock = product.stock ?? Infinity; // Undefined stock means unlimited availability
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
    return stock as number; // when stock is finite, cap at stock
  }
  const desired = Math.max(min, requested);
  const evenDesired = desired % 2 === 0 ? desired : desired + 1; // round up to next even
  return Math.min(evenDesired, stock as number);
}

/**
 * Adds a product to the cart.
 */
export function addToCart(product: Product, qty = 1) {
  const items = getCart();
  const index = items.findIndex(i => i.product.code === product.code);

  // Prevent adding when there's no stock (undefined stock means unlimited)
  if ((product.stock ?? Infinity) <= 0) {
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

/**
 * Updates the quantity of a product in the cart.
 */
export function updateQty(code: string, qty: number) {
  const items = getCart();
  const updated = items.map(i => {
    if (i.product.code !== code) {
      return i;
    }
    const adjusted = clampToStock(
      i.product,
      adjustQtyForDiscount(i.product, qty),
    );
    return { ...i, qty: adjusted };
  });
  setCart(updated);
  return updated;
}

/**
 * Removes a product from the cart.
 */
export function removeFromCart(code: string) {
  const items = getCart().filter(i => i.product.code !== code);
  setCart(items);
  return items;
}

/**
 * Clears the cart.
 */
export function clearCart() {
  setCart([]);
}
