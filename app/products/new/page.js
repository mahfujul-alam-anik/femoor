'use client';

import { useState } from 'react';

export default function ProductPage() {
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', active: true });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/products', { method: 'POST', body: JSON.stringify(form) });
    setMessage(res.ok ? 'Product added' : 'Failed');
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <form className="card space-y-3" onSubmit={submit}>
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea className="w-full rounded bg-slate-800 p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <label className="flex gap-2 items-center"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Active</label>
        <button className="rounded bg-cyan-500 px-4 py-2">Save</button>
      </form>
      {message && <p>{message}</p>}
      <ProductList />
    </div>
  );
}

function ProductList() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    const res = await fetch(`/api/products?q=${query}`);
    setItems(await res.json());
  };

  return (
    <div className="card">
      <div className="mb-2 flex gap-2">
        <input className="flex-1 rounded bg-slate-800 p-2" placeholder="Search product" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={load} className="rounded bg-slate-700 px-3">Search</button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-400"><th>Name</th><th>Status</th><th>Image</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-slate-800">
                <td>{item.name}</td><td>{item.active ? 'Active' : 'Inactive'}</td>
                <td>{item.imageUrl ? <a href={item.imageUrl} target="_blank">Preview</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
