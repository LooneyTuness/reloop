"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransitionWrapper({ 
  children, 
  className = "" 
}: PageTransitionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Skip transition on initial load
    if (previousPath === null) {
      setIsVisible(true);
      setPreviousPath(pathname);
      return;
    }

    // Start transition out
    setIsTransitioning(true);
    setIsVisible(false);
    
    // After transition out completes, start transition in
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setIsVisible(true);
      setPreviousPath(pathname);
    }, 100); // Reduced from 150ms for more subtle transitions

    return () => clearTimeout(timer);
  }, [pathname, previousPath]);

  // Special handling for dashboard route
  const isDashboard = pathname === '/dashboard';
  const transitionClass = isDashboard 
    ? 'transition-all duration-200 ease-out' 
    : 'transition-all duration-300 ease-out';

  return (
    <div 
      className={`page-transition-container ${transitionClass} ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-95 translate-y-1'
      } ${className}`}
      style={{
        willChange: 'transform, opacity',
        minHeight: isDashboard ? '100vh' : 'auto'
      }}
      data-route={isDashboard ? 'dashboard' : 'other'}
    >
      {children}
    </div>
  );
}
