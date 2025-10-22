'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { imageStorageService } from '@/lib/supabase/image-storage';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

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
  const { t } = useDashboardLanguage();
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
        <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
          {t('productImages')} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('uploadUpToImages').replace('{count}', maxImages.toString())}
        </p>
      </div>

      {/* Upload Area */}
      {canAddMore && (
        <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-8 hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-blue-50/30 dark:bg-blue-900/10">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
              ) : (
                <Upload size={32} className="text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  if (!isUploading) {
                    console.log('SimpleImageUpload: Upload button clicked, fileInputRef:', fileInputRef.current);
                    fileInputRef.current?.click();
                  }
                }}
                disabled={isUploading}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? t('uploading') : t('clickToUpload')}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t('pngJpgGifUpTo5MB')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized={true}
                />
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                title="Remove image"
              >
                <X size={14} />
              </button>
              
              {/* Image number badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state when no images */}
      {images.length === 0 && (
        <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-3">
            <Upload size={56} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t('noImagesUploadedYet')}</p>
          {required && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2 font-small">
              {t('atLeastOneImageRequired')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
