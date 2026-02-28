import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireRole } from '@/lib/auth/guards';
import { createSteadfastParcel } from '@/lib/services/steadfast';

export async function POST(req) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();
  const { orderId } = await req.json();
  const order = await Order.findById(orderId);
  const response = await createSteadfastParcel(order);
  order.steadfastTrackingId = response?.consignment?.tracking_code || response?.tracking_code;
  order.steadfastPayload = response;
  await order.save();
  return NextResponse.json({ trackingId: order.steadfastTrackingId, response });
}
