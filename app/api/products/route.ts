import { Product } from '@/app/types';

const products: Product[] = [
  {
    code: 'CA6',
    name: 'Cake',
    description: 'A delicious cake',
    price: 2.0,
    image: '/products-cake.svg',
  },
  {
    code: 'A21',
    name: 'Kitty litter',
    description: 'Litter for your kitty',
    price: 18.99,
    image: '/products-kitty-litter.svg',
  },
  {
    code: 'G95',
    name: 'Asparagus',
    description: 'Is it one? Is it a bundle? Buy and find out',
    price: 0.83,
    discount: 'P1',
    image: '/products-asparagus.svg',
  },
];

export function GET(_request: Request) {
  return Response.json(products);
}
