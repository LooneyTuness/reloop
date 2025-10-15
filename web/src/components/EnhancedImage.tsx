'use client';

import React, { useState } from 'react';
import { imageStorageService } from '@/lib/supabase/image-storage';

interface EnhancedImageProps {
  src: string | string[] | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
  retryCount?: number;
  enableRefresh?: boolean;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export default function EnhancedImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackText = "No Image",
  retryCount = 3,
  enableRefresh = true,
  onClick
}: EnhancedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    setRetryAttempts(0);
  }, [src]);

  const handleError = async (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load:', currentSrc);
    
    // If we haven't exceeded retry attempts and it's a Supabase image and refresh is enabled
    if (retryAttempts < retryCount && currentSrc && imageStorageService.isSupabaseImage(currentSrc) && enableRefresh) {
      console.log(`Retrying image load (attempt ${retryAttempts + 1}/${retryCount})...`);
      
      setIsRefreshing(true);
      setRetryAttempts(prev => prev + 1);
      
      // Check if image is accessible
      const isAccessible = await imageStorageService.isImageAccessible(currentSrc);
      
      if (isAccessible) {
        // Image is accessible, try refreshing the URL
        const refreshedUrl = imageStorageService.getRefreshedImageUrl(currentSrc);
        console.log('Trying refreshed URL:', refreshedUrl);
        
        // Try loading the refreshed URL
        const img = new Image();
        img.onload = () => {
          console.log('Refreshed image loaded successfully');
          setImageError(false);
          setIsRefreshing(false);
          // Update the src to the refreshed URL
          if (e.currentTarget) {
            e.currentTarget.src = refreshedUrl;
          }
        };
        img.onerror = () => {
          console.log('Refreshed image also failed to load');
          setIsRefreshing(false);
          if (retryAttempts + 1 >= retryCount) {
            setImageError(true);
          } else {
            // Try again after a short delay
            setTimeout(() => {
              handleError(e);
            }, 1000);
          }
        };
        img.src = refreshedUrl;
        return;
      } else {
        // Image is not accessible, try again after a delay
        setIsRefreshing(false);
        setTimeout(() => {
          handleError(e);
        }, 2000);
        return;
      }
    }
    
    setImageError(true);
    setIsRefreshing(false);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', currentSrc?.substring(0, 50) + '...');
    setIsRefreshing(false);
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

  // Show loading state while refreshing
  if (isRefreshing) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">Refreshing image...</p>
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
      onLoad={handleLoad}
      onClick={onClick}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
