'use client';

import { useEffect, useState } from 'react';

export default function ModeratorsPage() {
  const [mods, setMods] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const load = async () => setMods(await fetch('/api/moderators').then((r) => r.json()));
  useEffect(() => {
    load();
  }, []);

  const createMod = async (e) => {
    e.preventDefault();
    await fetch('/api/moderators', { method: 'POST', body: JSON.stringify(form) });
    setForm({ name: '', email: '', password: '' });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Moderator Management</h1>
      <form onSubmit={createMod} className="card grid gap-2 md:grid-cols-3">
        <input className="rounded bg-slate-800 p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="rounded bg-slate-800 p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="rounded bg-cyan-500 px-4 py-2">Add Moderator</button>
      </form>
      <div className="card">
        {mods.map((m) => (
          <div key={m._id} className="border-b border-slate-800 py-2 flex justify-between"><span>{m.name} ({m.email})</span><span>{m.active ? 'Active' : 'Inactive'}</span></div>
        ))}
      </div>
    </div>
  );
}
