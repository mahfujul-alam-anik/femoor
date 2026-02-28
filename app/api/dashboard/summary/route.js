import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireRole } from '@/lib/auth/guards';

function rangeFromPeriod(period, from, to) {
  const now = new Date();
  if (period === 'monthly') return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  if (period === 'yearly') return { from: new Date(now.getFullYear(), 0, 1), to: now };
  if (period === 'custom' && from && to) return { from: new Date(from), to: new Date(to) };
  return null;
}

export async function GET(request) {
  const auth = await requireRole(['super_admin', 'moderator']);
  if (auth.error) return auth.error;
  await connectDB();

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all';
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const range = rangeFromPeriod(period, from, to);
  const filter = range ? { createdAt: { $gte: range.from, $lte: range.to } } : {};

  const orders = await Order.find(filter).lean();
  const totalOrders = orders.length;
  const byStatus = orders.reduce((acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }), {});
  const totalRevenue = orders.reduce((n, o) => n + (o.totalPrice || 0), 0);
  const totalDeliveryCost = orders.reduce((n, o) => n + (o.deliveryCost || 0), 0);
  const cancelAmount = orders.filter((o) => o.status === 'cancelled').reduce((n, o) => n + (o.totalPrice || 0), 0);
  const partialAmount = orders.filter((o) => o.status === 'partial').reduce((n, o) => n + (o.totalPrice || 0), 0);

  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleString('en-US', { month: 'short' }),
    revenue: orders.filter((o) => new Date(o.createdAt).getMonth() === i).reduce((n, o) => n + (o.totalPrice || 0), 0)
  }));

  const monthlyGrowthTrends = monthlyRevenue.map((item, idx) => {
    if (idx === 0) return { month: item.month, growth: 0 };
    const prev = monthlyRevenue[idx - 1].revenue;
    const growth = prev === 0 ? 100 : ((item.revenue - prev) / prev) * 100;
    return { month: item.month, growth: Number(growth.toFixed(2)) };
  });

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
    monthlyGrowthTrends,
    statusDistribution: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    monthlyRevenue
  };

  if (auth.session.user.role !== 'super_admin') delete response.netProfit;

  return NextResponse.json(response);
}
