'use client';

import React, { useState, useEffect } from 'react';

interface PlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export default function PlaceholderImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackText = "No Image"
}: PlaceholderImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    
    // Set a longer timeout to show fallback if image doesn't load within 30 seconds
    const timeout = setTimeout(() => {
      console.log('Image load timeout for:', src.substring(0, 50) + '...');
      setImageError(true);
    }, 30000); // Increased from 10 to 30 seconds
    
    return () => clearTimeout(timeout);
  }, [src]); // Only depend on src, not on imageLoaded or imageError

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load:', src);
    console.log('Error event:', e);
    
    // For Supabase images, try to refresh the URL before giving up
    if (src.includes('supabase.co') && src.includes('/storage/v1/object/public/images/')) {
      console.log('Attempting to refresh Supabase image URL...');
      // Add a cache-busting parameter to force refresh
      const url = new URL(src);
      url.searchParams.set('t', Date.now().toString());
      const refreshedSrc = url.toString();
      
      // Try loading the refreshed URL
      const img = new Image();
      img.onload = () => {
        console.log('Refreshed image loaded successfully');
        setImageError(false);
        setImageLoaded(true);
        // Update the src to the refreshed URL
        if (e.currentTarget) {
          e.currentTarget.src = refreshedSrc;
        }
      };
      img.onerror = () => {
        console.log('Refreshed image also failed to load');
        setImageError(true);
      };
      img.src = refreshedSrc;
      return;
    }
    
    setImageError(true);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', src.substring(0, 50) + '...');
    setImageLoaded(true);
  };

  // Show fallback only if there's an error or if src is truly invalid
  if (imageError || !src || src === '' || src === null || src === undefined) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
        <div className="text-center p-4">
          <svg 
            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">{fallbackText}</p>
        </div>
      </div>
    );
  }

  // If it's a placeholder API URL or data URL, show it directly without timeout
  if (src.includes('/api/placeholder/') || src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
    );
  }

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
}
