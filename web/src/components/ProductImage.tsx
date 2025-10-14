'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string | string[] | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackText = "No Image"
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  // Get the first valid image source
  React.useEffect(() => {
    let imageSrc = null;
    
    if (Array.isArray(src)) {
      imageSrc = src[0] || null;
    } else {
      imageSrc = src || null;
    }
    
    // Clean up the image source
    if (imageSrc) {
      // Handle different types of image sources
      if (imageSrc.startsWith('data:')) {
        // Base64 images
        setCurrentSrc(imageSrc);
      } else if (imageSrc.startsWith('http')) {
        // External URLs
        setCurrentSrc(imageSrc);
      } else if (imageSrc.startsWith('/')) {
        // Local paths
        setCurrentSrc(imageSrc);
      } else if (imageSrc.startsWith('blob:')) {
        // Blob URLs
        setCurrentSrc(imageSrc);
      } else {
        // Try to construct a valid path
        const constructedPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
        setCurrentSrc(constructedPath);
      }
    } else {
      setCurrentSrc(null);
    }
    
    setImageError(false);
  }, [src]);

  const handleError = () => {
    // Try to load a placeholder image as fallback
    if (currentSrc && !currentSrc.includes('placeholder') && !currentSrc.includes('/api/placeholder/')) {
      setCurrentSrc('/api/placeholder/400/400');
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  // If no source or error, show placeholder
  if (!currentSrc || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
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
          <p className="text-xs text-gray-500 font-medium">{fallbackText}</p>
        </div>
      </div>
    );
  }

  // Use regular img tag for better compatibility with different image sources
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
