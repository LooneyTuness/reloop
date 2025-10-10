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
  const pathname = usePathname();

  useEffect(() => {
    // Start transition out
    setIsTransitioning(true);
    setIsVisible(false);
    
    // After transition out completes, start transition in
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div 
      className={`page-transition-container transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      } ${className}`}
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}
