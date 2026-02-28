import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireRole } from '@/lib/auth/guards';

export async function GET() {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();

  const orders = await Order.find().lean();
  const totalOrders = orders.length;
  const byStatus = orders.reduce((acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }), {});
  const totalRevenue = orders.reduce((n, o) => n + (o.totalPrice || 0), 0);
  const totalDeliveryCost = orders.reduce((n, o) => n + (o.deliveryCost || 0), 0);
  const cancelAmount = orders.filter((o) => o.status === 'cancelled').reduce((n, o) => n + (o.totalPrice || 0), 0);
  const partialAmount = orders.filter((o) => o.status === 'partial').reduce((n, o) => n + (o.totalPrice || 0), 0);

  const response = {
    totalOrders,
    totalDelivered: byStatus.delivered || 0,
    totalReturned: byStatus.returned || 0,
    partialReturns: byStatus.partial || 0,
    totalPendingDelivery: (byStatus.pending || 0) + (byStatus.processing || 0),
    totalCancelled: byStatus.cancelled || 0,
    totalExchangeOrders: orders.filter((o) => o.exchange).length,
    totalRevenue,
    totalDeliveryCost,
    netProfit: totalRevenue - totalDeliveryCost,
    cancelAmount,
    partialAmount,
    averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
    deliverySuccessRate: totalOrders ? ((byStatus.delivered || 0) / totalOrders) * 100 : 0,
    returnRate: totalOrders ? (((byStatus.returned || 0) + (byStatus.partial || 0)) / totalOrders) * 100 : 0,
    statusDistribution: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString('en-US', { month: 'short' }),
      revenue: orders.filter((o) => new Date(o.createdAt).getMonth() === i).reduce((n, o) => n + (o.totalPrice || 0), 0)
    }))
  };

  if (auth.session.user.role !== 'super_admin') delete response.netProfit;

  return NextResponse.json(response);
}
