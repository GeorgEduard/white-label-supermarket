export interface Product {
  code: string;
  name: string;
  price: number;
  description: string;
  image: string;
  discount?: string;
}

export interface Discount {
  id: string;
  type: DiscountType;
  discount?: number;
  label?: string;
}

type DiscountType = 'fixed' | 'percentage' | 'one-free';

export interface CartItem {
  product: Product;
  qty: number;
}
