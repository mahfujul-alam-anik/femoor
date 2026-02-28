import CourierLog from '@/lib/models/CourierLog';
import Order from '@/lib/models/Order';
import OrderStatusHistory from '@/lib/models/OrderStatusHistory';
import { safeFetch } from '@/lib/utils/http';

const statusMap = {
  delivered: 'delivered',
  cancelled: 'cancelled',
  partial_delivered: 'partial',
  returned: 'returned'
};

function headers() {
  return {
    'Content-Type': 'application/json',
    'Api-Key': process.env.STEADFAST_API_KEY,
    'Secret-Key': process.env.STEADFAST_SECRET_KEY
  };
}

export async function createSteadfastParcel(order) {
  const payload = {
    invoice: String(order._id),
    recipient_name: order.customer.fullName,
    recipient_phone: order.customer.phone,
    recipient_address: order.customer.address,
    cod_amount: order.totalPrice,
    note: order.note,
    item_description: order.itemDescription || 'Order item',
    total_lot: order.quantity,
    weight: order.weightKg || 0.5
  };

  try {
    const response = await safeFetch(`${process.env.STEADFAST_API_BASE_URL}/create_order`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload)
    });

    await CourierLog.create({ orderId: order._id, action: 'push', success: true, request: payload, response });
    return response;
  } catch (error) {
    await CourierLog.create({ orderId: order._id, action: 'push', success: false, request: payload, error: error.message, retries: 1 });
    throw error;
  }
}

export async function syncTrackingForOrder(order) {
  if (!order.steadfastTrackingId) return null;
  const response = await safeFetch(`${process.env.STEADFAST_API_BASE_URL}/status_by_trackingcode/${order.steadfastTrackingId}`, {
    headers: headers()
  });

  const mapped = statusMap[response?.delivery_status];
  if (mapped && mapped !== order.status) {
    const prev = order.status;
    order.status = mapped;
    await order.save();
    await OrderStatusHistory.create({ orderId: order._id, fromStatus: prev, toStatus: mapped, source: 'steadfast' });
  }

  await CourierLog.create({ orderId: order._id, action: 'track', success: true, response });
  return response;
}

export async function syncAllPendingOrders() {
  const orders = await Order.find({ steadfastTrackingId: { $exists: true }, status: { $in: ['pending', 'processing'] } });
  const results = [];
  for (const order of orders) {
    try {
      const data = await syncTrackingForOrder(order);
      results.push({ orderId: order._id, ok: true, data });
    } catch (e) {
      results.push({ orderId: order._id, ok: false, error: e.message });
    }
  }
  return results;
}
