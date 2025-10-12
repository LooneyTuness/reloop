'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on seller dashboard pages
  if (pathname?.startsWith('/seller-dashboard')) {
    return null;
  }
  
  return <Navbar />;
}
