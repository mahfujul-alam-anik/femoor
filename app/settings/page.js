'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [form, setForm] = useState({ adminEmail: '', steadfastApiKey: '', steadfastSecret: '' });

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => setForm({
      adminEmail: d.adminEmail || '',
      steadfastApiKey: d.steadfastApiKey || '',
      steadfastSecret: d.steadfastSecret || ''
    }));
  }, []);

  const save = async () => {
    await fetch('/api/settings', { method: 'PATCH', body: JSON.stringify(form) });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Admin Settings</h1>
      <div className="card space-y-2">
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Admin Email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Steadfast API Key" value={form.steadfastApiKey} onChange={(e) => setForm({ ...form, steadfastApiKey: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Steadfast Secret" value={form.steadfastSecret} onChange={(e) => setForm({ ...form, steadfastSecret: e.target.value })} />
        <button onClick={save} className="rounded bg-cyan-500 px-4 py-2">Save Settings</button>
      </div>
    </div>
  );
}
