import type { NextRequest } from 'next/server';
import { promotions } from '@/app/api/promotions/promotions';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const promo = promotions.find(p => p.id === id);

  if (!promo) {
    return Response.json({ error: 'Promotion not found' }, { status: 404 });
  }

  return Response.json(promo);
}
