'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

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

  const handleFileSelect = (files: FileList | null) => {
    console.log('SimpleImageUpload: handleFileSelect called with files:', files);
    if (!files) return;

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

    const newImages: string[] = [];
    let processedCount = 0;

    validFiles.forEach((file, index) => {
      console.log(`SimpleImageUpload: Processing file ${index + 1}:`, file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        console.log(`SimpleImageUpload: File ${index + 1} loaded, URL length:`, imageUrl.length);
        newImages.push(imageUrl);
        processedCount++;
        
        console.log(`SimpleImageUpload: Processed ${processedCount}/${validFiles.length} files`);
        if (processedCount === validFiles.length) {
          console.log('SimpleImageUpload: All files processed, updating images:', newImages.length);
          onImagesChange([...images, ...newImages]);
        }
      };
      reader.onerror = (error) => {
        console.error('SimpleImageUpload: Error reading file:', error);
        alert(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SimpleImageUpload: File input changed:', e.target.files);
    handleFileSelect(e.target.files);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
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
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Upload size={24} className="text-gray-400" />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  console.log('SimpleImageUpload: Upload button clicked, fileInputRef:', fileInputRef.current);
                  fileInputRef.current?.click();
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Click to upload
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
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
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
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Upload size={48} className="mx-auto mb-2 opacity-50" />
          <p>No images uploaded yet</p>
          {required && (
            <p className="text-sm text-red-500 mt-1">At least one image is required</p>
          )}
        </div>
      )}
    </div>
  );
}
