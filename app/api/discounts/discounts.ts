import { Discount } from '@/app/types';

export const discounts: Discount[] = [
  {
    id: 'P1',
    type: 'one-free',
    label: 'Buy one get one',
    scope: 'product',
  },
  {
    id: 'P2',
    type: 'percentage',
    scope: 'cart',
    value: 20,
    threshold: 10,
    isActive: true,
    label: '20% off for orders over £10',
  },
];
