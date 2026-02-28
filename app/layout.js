import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import Sidebar from '@/components/layout/Sidebar';
import Providers from '@/components/layout/Providers';

export const metadata = {
  title: 'Femoor OMS',
  description: 'Order management and sales analytics platform'
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers>
        <div className="min-h-screen md:flex">
          {session?.user && <Sidebar role={session.user.role} />}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
        </Providers>
      </body>
    </html>
  );
}
