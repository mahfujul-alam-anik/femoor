'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  ['Dashboard', '/dashboard'],
  ['Products', '/products/new'],
  ['Orders', '/orders/new'],
  ['Moderators', '/moderators'],
  ['Settings', '/settings']
];

export default function Sidebar({ role }) {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-900 p-4 md:w-64 md:border-b-0 md:border-r">
      <h2 className="mb-4 text-lg font-semibold">Femoor OMS</h2>
      <nav className="space-y-1">
        {links.map(([name, href]) => {
          if (name === 'Moderators' && role !== 'super_admin') return null;
          return (
            <Link key={href} href={href} className={clsx('block rounded px-3 py-2 text-sm', pathname.startsWith(href) ? 'bg-slate-800' : 'hover:bg-slate-800/70')}>
              {name}
            </Link>
          );
        })}
      </nav>
      <button onClick={() => signOut({ callbackUrl: '/login' })} className="mt-6 rounded bg-slate-800 px-3 py-2 text-sm">
        Sign out
      </button>
    </aside>
  );
}
