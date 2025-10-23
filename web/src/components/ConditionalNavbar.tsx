'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on seller dashboard pages, launch page, and sign-in page
  if (pathname?.startsWith('/seller-dashboard') || 
      pathname === '/' || 
      pathname === '/sign-in' ||
      pathname === '/login') {
    return null;
  }
  
  return <Navbar />;
}
