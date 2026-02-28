'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@femoor.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto mt-24 max-w-md card">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded bg-slate-800 p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded bg-slate-800 p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full rounded bg-cyan-500 py-2 font-medium">Login</button>
      </form>
    </div>
  );
}
