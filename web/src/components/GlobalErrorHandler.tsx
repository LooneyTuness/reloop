'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle browser extension communication errors
    const handleError = (event: ErrorEvent) => {
      // Suppress common browser extension errors
      if (
        event.message?.includes('listener indicated an asynchronous response') ||
        event.message?.includes('message channel closed') ||
        event.message?.includes('Extension context invalidated') ||
        event.message?.includes('Could not establish connection')
      ) {
        event.preventDefault();
        event.stopPropagation();
        console.warn('Suppressed browser extension error:', event.message);
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress browser extension promise rejection errors
      if (
        event.reason?.message?.includes('listener indicated an asynchronous response') ||
        event.reason?.message?.includes('message channel closed') ||
        event.reason?.message?.includes('Extension context invalidated') ||
        event.reason?.message?.includes('Could not establish connection')
      ) {
        event.preventDefault();
        console.warn('Suppressed browser extension promise rejection:', event.reason?.message);
        return false;
      }
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}
