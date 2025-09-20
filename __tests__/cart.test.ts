import { addToCart, clearCart, getCart, getCartPrice, isOneFree, updateQty } from '@/app/lib/cart';
import type { Product } from '@/app/types';

const normalProduct: Product = {
  code: 'N1',
  name: 'Normal',
  price: 5,
  description: 'Normal product',
  image: '/x.svg',
};

const oneFreeProduct: Product = {
  code: 'OF1',
  name: 'One Free',
  price: 4,
  description: 'BOGO',
  image: '/y.svg',
  discount: 'P1', // maps to one-free in app/api/discounts/discounts.ts
};

describe('cart library', () => {
  beforeEach(() => {
    clearCart();
  });

  test('isOneFree detects the one-free discount', () => {
    expect(isOneFree(normalProduct)).toBe(false);
    expect(isOneFree(oneFreeProduct)).toBe(true);
  });

  test('addToCart for normal product increases by 1 each add', () => {
    addToCart(normalProduct);
    let items = getCart();
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(1);

    addToCart(normalProduct);
    items = getCart();
    expect(items[0].qty).toBe(2);
  });

  test('addToCart for one-free product adds 2 and charges for 1 unit', () => {
    addToCart(oneFreeProduct);
    const items = getCart();
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2); // quantity normalized to even and min 2

    const linePrice = getCartPrice(oneFreeProduct, items[0].qty);
    // Pay for only half the qty (2 -> 1 unit)
    expect(linePrice).toBe(4);
  });

  test('updateQty enforces min/step for one-free items', () => {
    addToCart(oneFreeProduct); // qty 2

    // Try to set to odd number (3) -> should normalize to 4
    updateQty(oneFreeProduct.code, 3);
    let items = getCart();
    expect(items[0].qty).toBe(4);

    // Try to set less than minimum -> normalize to 2
    updateQty(oneFreeProduct.code, 1);
    items = getCart();
    expect(items[0].qty).toBe(2);
  });

  test('getCartPrice multiplies price by qty for normal products', () => {
    expect(getCartPrice(normalProduct, 3)).toBe(15);
  });
});
