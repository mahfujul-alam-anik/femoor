import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import OrderStatusHistory from '@/lib/models/OrderStatusHistory';

const map = { delivered: 'delivered', cancelled: 'cancelled', partial_delivered: 'partial', returned: 'returned' };

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const tracking = body.tracking_code;
  const order = await Order.findOne({ steadfastTrackingId: tracking });
  if (!order) return NextResponse.json({ ok: true });

  const next = map[body.status];
  if (next && next !== order.status) {
    const prev = order.status;
    order.status = next;
    await order.save();
    await OrderStatusHistory.create({ orderId: order._id, fromStatus: prev, toStatus: next, source: 'steadfast' });
  }

  return NextResponse.json({ ok: true });
}
