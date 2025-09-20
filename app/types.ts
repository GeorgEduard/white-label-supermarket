export interface Product {
  code: string;
  name: string;
  price: number;
  description: string;
  image: string;
  promo?: string;
}

export interface Promo {
  id: string;
  type: PromoType;
  discount?: number;
}

type PromoType = 'fixed' | 'percentage' | 'one-free';
