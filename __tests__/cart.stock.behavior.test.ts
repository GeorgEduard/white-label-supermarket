import {
  addToCart,
  clearCart,
  getCart,
  getCartPrice,
  updateQty,
} from '@/app/lib/cart';
import type { Product } from '@/app/types';
// @ts-expect-error - Intentionally missing 'stock' property for testing
const normalNoStockField: Product = {
  code: 'NS-N',
  name: 'Normal No Stock',
  price: 3,
  description: 'No stock field normal',
  image: '/n.svg',
};
// @ts-expect-error - Intentionally missing 'stock' property for testing
const bogoNoStockField: Product = {
  code: 'NS-B',
  name: 'BOGO No Stock',
  price: 10,
  description: 'No stock field bogo',
  image: '/b.svg',
  discount: 'P1', // maps to one-free in app/api/discounts/discounts.ts
};

const zeroStock: Product = {
  code: 'Z0',
  name: 'Zero stock',
  price: 7,
  description: 'Zero stock product',
  image: '/z.svg',
  stock: 0,
};

const bogoFiniteOddStock: Product = {
  code: 'BOGO-5',
  name: 'BOGO finite odd stock',
  price: 8,
  description: 'BOGO with stock 5',
  image: '/bo.svg',
  discount: 'P1',
  stock: 5,
};

describe('cart stock-related behavior', () => {
  beforeEach(() => clearCart());

  test('normal product without stock field allows repeated adds with no cap', () => {
    addToCart(normalNoStockField); // +1
    addToCart(normalNoStockField); // +1 => 2
    addToCart(normalNoStockField, 3); // +3 => 5

    const items = getCart();
    expect(items).toHaveLength(1);
    expect(items[0].product.code).toBe(normalNoStockField.code);
    expect(items[0].qty).toBe(5);

    // price is qty * price (no discounts)
    expect(getCartPrice(normalNoStockField, items[0].qty)).toBe(5 * 3);
  });

  test('BOGO product without stock field adds in steps of 2 and has no cap', () => {
    addToCart(bogoNoStockField); // +2 (normalized)
    addToCart(bogoNoStockField); // +2 => 4

    let items = getCart();
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(4);

    // line price should be price * ceil(qty/2) => 10 * 2 = 20
    expect(getCartPrice(bogoNoStockField, items[0].qty)).toBe(20);

    // Adding an odd requested amount should still land on an even qty increment
    addToCart(bogoNoStockField, 3); // requested +3 -> normalized internally -> +4, qty 8
    items = getCart();
    expect(items[0].qty).toBe(8);
    expect(getCartPrice(bogoNoStockField, items[0].qty)).toBe(10 * 4);
  });

  test('product with stock=0 cannot be added to cart', () => {
    addToCart(zeroStock);
    const items = getCart();
    expect(items).toHaveLength(0);
  });

  test('BOGO with finite odd stock allows odd qty at stock cap and charges ceil(q/2)', () => {
    // Try to set qty to 5 (cap) via updateQty after initial add
    addToCart(bogoFiniteOddStock); // will add 2 initially
    updateQty(bogoFiniteOddStock.code, 5);

    const items = getCart();
    expect(items).toHaveLength(1);
    // At stock cap, odd 5 should be allowed
    expect(items[0].qty).toBe(5);

    // Price uses ceil(5/2) = 3 units * price(8) = 24
    expect(getCartPrice(bogoFiniteOddStock, items[0].qty)).toBe(24);
  });
});
