export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/products/:path*', '/moderators/:path*', '/settings/:path*']
};
