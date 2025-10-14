"use client";

import { usePathname } from 'next/navigation';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransitionWrapper({ 
  children, 
  className = "" 
}: PageTransitionWrapperProps) {
  const pathname = usePathname();

  // Special handling for dashboard route
  const isDashboard = pathname === '/dashboard';

  return (
    <div 
      className={`page-transition-container bg-white ${className}`}
      style={{
        minHeight: isDashboard ? '100vh' : 'auto'
      }}
      data-route={isDashboard ? 'dashboard' : 'other'}
    >
      {children}
    </div>
  );
}
