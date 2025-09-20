export interface Product {
  code: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  discount?: string;
}

interface ProductDiscount {
  id: string;
  type: DiscountType;
  scope: DiscountScope;
  label: string;
  value?: number;
}

export interface CartDiscount extends Omit<ProductDiscount, 'value'> {
  value: number;
  threshold: number;
  isActive: boolean;
}

type DiscountType = 'fixed' | 'percentage' | 'one-free';
type DiscountScope = 'product' | 'cart';

export type Discount = ProductDiscount | CartDiscount;

export interface CartItem {
  product: Product;
  qty: number;
}
