import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login'
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/products/:path*', '/moderators/:path*', '/settings/:path*']
};
