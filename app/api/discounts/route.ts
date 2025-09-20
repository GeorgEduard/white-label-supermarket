import { discounts } from '@/app/api/discounts/discounts';

export function GET(_request: Request) {
  return Response.json(discounts);
}
