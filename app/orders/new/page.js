'use client';

import { useEffect, useMemo, useState } from 'react';

const init = {
  customer: { fullName: '', phone: '', alternativePhone: '', email: '', address: '', district: '', thana: '' },
  productId: '',
  quantity: 1,
  itemDescription: '',
  note: '',
  weightKg: 0.5,
  exchange: false,
  exactPrice: 0,
  sellingPrice: 0,
  totalPrice: 0,
  deliveryCost: 0,
  status: 'pending',
  pushToSteadfast: true
};

export default function OrderPage() {
  const [form, setForm] = useState(init);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts);
    fetch('/api/orders').then((r) => r.json()).then(setOrders);
  }, []);

  const total = useMemo(() => Number(form.sellingPrice || 0) * Number(form.quantity || 0), [form.sellingPrice, form.quantity]);

  const submit = async (e) => {
    e.preventDefault();
    await fetch('/api/orders', { method: 'POST', body: JSON.stringify({ ...form, totalPrice: total, quantity: Number(form.quantity), weightKg: Number(form.weightKg), exactPrice: Number(form.exactPrice), sellingPrice: Number(form.sellingPrice), deliveryCost: Number(form.deliveryCost) }) });
    const refreshed = await fetch('/api/orders').then((r) => r.json());
    setOrders(refreshed);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Add Order</h1>
      <form onSubmit={submit} className="card grid gap-2 md:grid-cols-2">
        <input className="rounded bg-slate-800 p-2" placeholder="Customer Name" onChange={(e) => setForm({ ...form, customer: { ...form.customer, fullName: e.target.value } })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Phone" onChange={(e) => setForm({ ...form, customer: { ...form.customer, phone: e.target.value } })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Alternative Phone" onChange={(e) => setForm({ ...form, customer: { ...form.customer, alternativePhone: e.target.value } })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Email" onChange={(e) => setForm({ ...form, customer: { ...form.customer, email: e.target.value } })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Address" onChange={(e) => setForm({ ...form, customer: { ...form.customer, address: e.target.value } })} />
        <input className="rounded bg-slate-800 p-2" placeholder="District" onChange={(e) => setForm({ ...form, customer: { ...form.customer, district: e.target.value } })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Thana" onChange={(e) => setForm({ ...form, customer: { ...form.customer, thana: e.target.value } })} />
        <select className="rounded bg-slate-800 p-2" onChange={(e) => setForm({ ...form, productId: e.target.value })}><option>Select Product</option>{products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}</select>
        <input type="number" className="rounded bg-slate-800 p-2" placeholder="Qty" onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input type="number" className="rounded bg-slate-800 p-2" placeholder="Exact Price" onChange={(e) => setForm({ ...form, exactPrice: e.target.value })} />
        <input type="number" className="rounded bg-slate-800 p-2" placeholder="Selling Price" onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
        <input type="number" className="rounded bg-slate-800 p-2" placeholder="Delivery Cost" onChange={(e) => setForm({ ...form, deliveryCost: e.target.value })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Item Description" onChange={(e) => setForm({ ...form, itemDescription: e.target.value })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Note" onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <select className="rounded bg-slate-800 p-2" onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="processing">Processing</option><option value="delivered">Delivered</option><option value="returned">Returned</option><option value="partial">Partial</option><option value="cancelled">Cancelled</option></select>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.pushToSteadfast} onChange={(e) => setForm({ ...form, pushToSteadfast: e.target.checked })} />Push to Steadfast</label>
        <div className="font-semibold">Total: {total}</div>
        <button className="rounded bg-cyan-500 px-4 py-2">Create Order</button>
      </form>

      <div className="card overflow-auto">
        <h2 className="mb-2 font-medium">Order Management</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-400"><th>Date</th><th>Customer</th><th>Status</th><th>Total</th><th>Tracking</th></tr></thead>
          <tbody>{orders.map((o) => <tr key={o._id} className="border-t border-slate-800"><td>{new Date(o.createdAt).toLocaleDateString()}</td><td>{o.customer?.fullName}</td><td>{o.status}</td><td>{o.totalPrice}</td><td>{o.steadfastTrackingId || '-'}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
