import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { requireRole } from '@/lib/auth/guards';
import { syncAllPendingOrders } from '@/lib/services/steadfast';

export async function POST() {
  const auth = await requireRole(['super_admin']);
  if (auth.error) return auth.error;
  await connectDB();
  const results = await syncAllPendingOrders();
  return NextResponse.json({ results });
}
