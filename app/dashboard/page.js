'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusChart from '@/components/charts/StatusChart';
import RevenueChart from '@/components/charts/RevenueChart';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard/summary').then((r) => r.json()).then(setData);
  }, []);

  const metrics = useMemo(() => {
    if (!data) return [];
    return [
      ['Total Orders', data.totalOrders],
      ['Delivered', data.totalDelivered],
      ['Returned', data.totalReturned],
      ['Partial Returns', data.partialReturns],
      ['Pending Delivery', data.totalPendingDelivery],
      ['Cancelled', data.totalCancelled],
      ['Exchange Orders', data.totalExchangeOrders],
      ['Total Revenue', data.totalRevenue],
      ['Delivery Cost', data.totalDeliveryCost],
      ...(data.netProfit !== undefined ? [['Net Profit', data.netProfit]] : []),
      ['Cancel Amount', data.cancelAmount],
      ['Partial Amount', data.partialAmount],
      ['Avg Order Value', data.averageOrderValue?.toFixed?.(2)],
      ['Success Rate', `${data.deliverySuccessRate?.toFixed?.(1)}%`],
      ['Return Rate', `${data.returnRate?.toFixed?.(1)}%`]
    ];
  }, [data]);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="card">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusChart data={data.statusDistribution || []} />
        <RevenueChart data={data.monthlyRevenue || []} />
      </div>
    </div>
  );
}
