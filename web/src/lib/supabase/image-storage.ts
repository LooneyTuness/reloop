import { createBrowserClient } from './supabase.browser';

export class ImageStorageService {
  private supabase = createBrowserClient();

  /**
   * Upload image files to Supabase Storage
   * @param files - Array of File objects
   * @param folder - Folder name in storage (e.g., 'products', 'profiles')
   * @param userId - User ID for organizing files
   * @returns Array of public URLs
   */
  async uploadImages(
    files: File[], 
    folder: string, 
    userId: string
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        // Upload file to Supabase Storage
        const { error } = await this.supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '31536000', // 1 year cache for better performance
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          throw error;
        }

        // Get public URL
        const { data: urlData } = this.supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        return urlData.publicUrl;
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  }

  /**
   * Upload a single image file
   * @param file - File object
   * @param folder - Folder name in storage
   * @param userId - User ID for organizing files
   * @returns Public URL
   */
  async uploadImage(
    file: File, 
    folder: string, 
    userId: string
  ): Promise<string> {
    const urls = await this.uploadImages([file], folder, userId);
    return urls[0];
  }

  /**
   * Delete image from Supabase Storage
   * @param imageUrl - Public URL of the image
   * @param folder - Folder name in storage
   */
  async deleteImage(imageUrl: string, folder: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const userId = pathParts[pathParts.length - 2];
      const filePath = `${folder}/${userId}/${fileName}`;

      const { error } = await this.supabase.storage
        .from('images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Delete multiple images from Supabase Storage
   * @param imageUrls - Array of public URLs
   * @param folder - Folder name in storage
   */
  async deleteImages(imageUrls: string[], folder: string): Promise<void> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url, folder));
    await Promise.all(deletePromises);
  }

  /**
   * Check if image URL is from Supabase Storage
   * @param url - Image URL
   * @returns boolean
   */
  isSupabaseImage(url: string): boolean {
    return url.includes('supabase.co') && url.includes('/storage/v1/object/public/images/');
  }

  /**
   * Get optimized image URL with transformations
   * @param imageUrl - Original image URL
   * @param width - Desired width
   * @param height - Desired height
   * @param quality - Image quality (1-100)
   * @returns Optimized image URL
   */
  getOptimizedImageUrl(
    imageUrl: string, 
    width?: number, 
    height?: number, 
    quality: number = 80
  ): string {
    if (!this.isSupabaseImage(imageUrl)) {
      return imageUrl;
    }

    // For Supabase Storage, we can add query parameters for optimization
    // Note: This requires Supabase Image Transformations to be enabled
    const url = new URL(imageUrl);
    
    if (width) url.searchParams.set('width', width.toString());
    if (height) url.searchParams.set('height', height.toString());
    url.searchParams.set('quality', quality.toString());
    
    return url.toString();
  }

  /**
   * Get a refreshed image URL with cache-busting parameter
   * @param imageUrl - Original image URL
   * @returns Refreshed image URL
   */
  getRefreshedImageUrl(imageUrl: string): string {
    if (!this.isSupabaseImage(imageUrl)) {
      return imageUrl;
    }

    const url = new URL(imageUrl);
    url.searchParams.set('t', Date.now().toString());
    return url.toString();
  }

  /**
   * Check if an image URL is accessible
   * @param imageUrl - Image URL to check
   * @returns Promise<boolean>
   */
  async isImageAccessible(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking image accessibility:', error);
      return false;
    }
  }
}

export const imageStorageService = new ImageStorageService();
