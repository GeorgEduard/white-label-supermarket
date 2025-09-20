export interface Product {
  code: string;
  name: string;
  price: number;
  description: string;
  image: string;
  discount?: string;
}

interface BaseDiscount {
  id: string;
  type: DiscountType;
  scope: DiscountScope;
  discount?: number;
}

interface ProductDiscount extends BaseDiscount {
  label: string;
}
interface CartDiscount extends BaseDiscount {
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
