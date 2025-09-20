import { promotions } from '@/app/api/promotions/promotions';

export function GET(_request: Request) {
  return Response.json(promotions);
}
