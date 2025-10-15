import { imageStorageService } from '@/lib/supabase/image-storage';

/**
 * Utility functions for handling images in the application
 */

/**
 * Validates if an image URL is accessible
 * @param imageUrl - The image URL to validate
 * @returns Promise<boolean>
 */
export async function validateImageUrl(imageUrl: string): Promise<boolean> {
  if (!imageUrl || imageUrl.trim() === '') {
    return false;
  }

  // Check if it's a placeholder URL
  if (imageUrl.includes('/api/placeholder/')) {
    return true;
  }

  // Check if it's a data URL
  if (imageUrl.startsWith('data:')) {
    return true;
  }

  // For Supabase images, use the storage service
  if (imageStorageService.isSupabaseImage(imageUrl)) {
    return await imageStorageService.isImageAccessible(imageUrl);
  }

  // For other URLs, do a basic fetch check
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
}

/**
 * Gets a refreshed image URL with cache-busting
 * @param imageUrl - The original image URL
 * @returns string
 */
export function getRefreshedImageUrl(imageUrl: string): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return imageUrl;
  }

  // For Supabase images, use the storage service
  if (imageStorageService.isSupabaseImage(imageUrl)) {
    return imageStorageService.getRefreshedImageUrl(imageUrl);
  }

  // For other URLs, add a timestamp parameter
  try {
    const url = new URL(imageUrl);
    url.searchParams.set('t', Date.now().toString());
    return url.toString();
  } catch (error) {
    // If URL parsing fails, just add a timestamp to the end
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}t=${Date.now()}`;
  }
}

/**
 * Gets the first valid image from an array or single image
 * @param images - Array of images or single image
 * @returns string | null
 */
export function getFirstValidImage(images: string | string[] | null | undefined): string | null {
  if (!images) {
    return null;
  }

  const imageArray = Array.isArray(images) ? images : [images];
  const validImage = imageArray.find(img => img && img.trim() !== '');
  
  return validImage || null;
}

/**
 * Checks if an image URL is a placeholder
 * @param imageUrl - The image URL to check
 * @returns boolean
 */
export function isPlaceholderImage(imageUrl: string): boolean {
  return imageUrl.includes('/api/placeholder/') || 
         imageUrl.includes('placeholder') ||
         imageUrl === '' ||
         imageUrl === null ||
         imageUrl === undefined;
}

/**
 * Gets an optimized image URL for display
 * @param imageUrl - The original image URL
 * @param width - Desired width
 * @param height - Desired height
 * @param quality - Image quality (1-100)
 * @returns string
 */
export function getOptimizedImageUrl(
  imageUrl: string, 
  width?: number, 
  height?: number, 
  quality: number = 80
): string {
  if (!imageUrl || isPlaceholderImage(imageUrl)) {
    return imageUrl;
  }

  // For Supabase images, use the storage service
  if (imageStorageService.isSupabaseImage(imageUrl)) {
    return imageStorageService.getOptimizedImageUrl(imageUrl, width, height, quality);
  }

  return imageUrl;
}
