import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import OrderStatusHistory from '@/lib/models/OrderStatusHistory';
import { orderSchema } from '@/lib/validators/order';
import { requireRole } from '@/lib/auth/guards';
import { createSteadfastParcel } from '@/lib/services/steadfast';

export async function GET(request) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const district = searchParams.get('district');
  const q = searchParams.get('q');
  const filter = {};
  if (status) filter.status = status;
  if (district) filter['customer.district'] = district;
  if (q) filter.$or = [{ 'customer.phone': { $regex: q, $options: 'i' } }, { steadfastTrackingId: { $regex: q, $options: 'i' } }];
  const orders = await Order.find(filter).populate('productId').sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(orders);
}

export async function POST(req) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();

  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 });

  const session = await mongoose.startSession();
  try {
    let order;
    await session.withTransaction(async () => {
      order = await Order.create([parsed.data], { session }).then((r) => r[0]);
      await OrderStatusHistory.create(
        [{ orderId: order._id, fromStatus: 'none', toStatus: order.status, source: 'system', actorId: auth.session.user.id }],
        { session }
      );
    });

    if (order.pushToSteadfast) {
      const response = await createSteadfastParcel(order);
      order.steadfastTrackingId = response?.consignment?.tracking_code || response?.tracking_code;
      order.steadfastPayload = response;
      await order.save();
    }

    return NextResponse.json(order, { status: 201 });
  } finally {
    await session.endSession();
  }
}

export async function PATCH(req) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();
  const { id, status, ...rest } = await req.json();
  const order = await Order.findById(id);
  const from = order.status;
  Object.assign(order, rest);
  if (status) order.status = status;
  await order.save();
  if (status && from !== status) {
    await OrderStatusHistory.create({ orderId: order._id, fromStatus: from, toStatus: status, source: 'manual', actorId: auth.session.user.id });
  }
  return NextResponse.json(order);
}
