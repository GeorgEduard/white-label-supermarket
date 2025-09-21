import { discounts } from '@/app/api/discounts/discounts';

/**
 * Get all discounts
 */
export function GET(_request: Request) {
  return Response.json(discounts);
}
