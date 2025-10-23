'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on seller dashboard pages, launch page, sign-in page, and auth pages
  if (pathname?.startsWith('/seller-dashboard') || 
      pathname === '/' || 
      pathname === '/sign-in' ||
      pathname === '/login' ||
      pathname?.startsWith('/auth/')) {
    return null;
  }
  
  return <Navbar />;
}
