import type { NextRequest } from 'next/server';
import { discounts } from '@/app/api/discounts/discounts';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const discount = discounts.find(p => p.id === id);

  if (!discount) {
    return Response.json({ error: 'Discount not found' }, { status: 404 });
  }

  return Response.json(discount);
}
