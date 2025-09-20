import { Promo } from '@/app/types';

const promotions: Promo[] = [
  {
    id: 'P1',
    type: 'one-free',
    label: 'Buy one get one free',
  },
];

export function GET(_request: Request) {
  return Response.json(promotions);
}
