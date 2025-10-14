'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ImageSkeleton from './ImageSkeleton';

interface OptimizedProductImageProps {
  src: string | string[] | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
  sizes?: string;
}

export default function OptimizedProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackText = "No Image",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: OptimizedProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
        // Base64 images - use directly
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
    setImageLoaded(false);
  }, [src]);

  const handleError = () => {
    setImageError(true);
  };

  const handleLoad = () => {
    setImageLoaded(true);
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

  // Show skeleton while loading
  if (!imageLoaded && !imageError) {
    return <ImageSkeleton className={className} />;
  }

  // For base64 images, use regular img tag as Next.js Image might have issues with very large base64 strings
  if (currentSrc && currentSrc.startsWith('data:')) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }
  
  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
