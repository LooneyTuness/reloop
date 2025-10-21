'use client';

import React, { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function OptimizedLink({ 
  href, 
  children, 
  className = '', 
  prefetch = true,
  onClick,
  disabled = false 
}: OptimizedLinkProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (prefetch && !prefetchedRef.current && !disabled) {
      // Prefetch on hover with a small delay to avoid unnecessary prefetches
      hoverTimeoutRef.current = setTimeout(() => {
        router.prefetch(href);
        prefetchedRef.current = true;
      }, 100);
    }
  }, [href, prefetch, disabled, router]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed opacity-50`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

// Optimized button component for navigation
interface OptimizedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  prefetchHref?: string;
}

export function OptimizedButton({ 
  onClick, 
  children, 
  className = '', 
  disabled = false,
  prefetchHref 
}: OptimizedButtonProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (prefetchHref && !prefetchedRef.current && !disabled) {
      hoverTimeoutRef.current = setTimeout(() => {
        router.prefetch(prefetchHref);
        prefetchedRef.current = true;
      }, 100);
    }
  }, [prefetchHref, disabled, router]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <button
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
