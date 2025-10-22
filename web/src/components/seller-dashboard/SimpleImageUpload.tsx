'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { imageStorageService } from '@/lib/supabase/image-storage';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface SimpleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  required?: boolean;
}

export default function SimpleImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  required = false 
}: SimpleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    console.log('SimpleImageUpload: handleFileSelect called with files:', files);
    if (!files || !user?.id) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}: Please select a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}: Image size must be less than 5MB`);
        return false;
      }
      return true;
    });

    console.log('SimpleImageUpload: Valid files:', validFiles.length);

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more images.`);
      return;
    }

    setIsUploading(true);

    try {
      // Upload files to Supabase Storage
      const uploadedUrls = await imageStorageService.uploadImages(
        validFiles, 
        'products', 
        user.id
      );

      console.log('SimpleImageUpload: Files uploaded successfully:', uploadedUrls);
      
      // Update images with the new URLs
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('SimpleImageUpload: Error uploading files:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SimpleImageUpload: File input changed:', e.target.files);
    handleFileSelect(e.target.files);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's a Supabase Storage URL, delete it from storage
    if (imageStorageService.isSupabaseImage(imageToRemove)) {
      try {
        await imageStorageService.deleteImage(imageToRemove, 'products');
        console.log('Image deleted from storage:', imageToRemove);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
        // Continue with removal from UI even if storage deletion fails
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Images {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Upload up to {maxImages} images. Click to select files.
        </p>
      </div>

      {/* Upload Area */}
      {canAddMore && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="space-y-2">
            <div className="flex">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : (
                  <Upload size={24} className="text-gray-400" />
                )}
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (!isUploading) {
                    console.log('SimpleImageUpload: Upload button clicked, fileInputRef:', fileInputRef.current);
                    fileInputRef.current?.click();
                  }
                }}
                disabled={isUploading}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Click to upload'}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 5MB each
            </p>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X size={12} />
              </button>
              
              {/* Image number badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state when no images */}
      {images.length === 0 && (
        <div className="py-8 text-gray-500 dark:text-gray-400">
          <div className="flex items-center mb-2">
            <Upload size={48} className="opacity-50" />
          </div>
          <p>No images uploaded yet</p>
          {required && (
            <p className="text-sm text-red-500 mt-1">At least one image is required</p>
          )}
        </div>
      )}
    </div>
  );
}
