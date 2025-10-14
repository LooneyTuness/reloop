'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import ImageCropModal from './ImageCropModal';

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  required?: boolean;
}

export default function MultipleImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  required = false 
}: MultipleImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file';
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    console.log('handleFileSelect called with files:', files);
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        return false;
      }
      return true;
    });

    console.log('Valid files:', validFiles.length);

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more images.`);
      return;
    }

    const newImages: string[] = [];
    let processedCount = 0;

    validFiles.forEach((file, index) => {
      console.log(`Processing file ${index + 1}:`, file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        console.log(`File ${index + 1} loaded, URL length:`, imageUrl.length);
        newImages.push(imageUrl);
        processedCount++;
        
        console.log(`Processed ${processedCount}/${validFiles.length} files`);
        if (processedCount === validFiles.length) {
          console.log('All files processed, updating images:', newImages.length);
          onImagesChange([...images, ...newImages]);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [images, maxImages]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    handleFileSelect(e.target.files);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(images[index]);
    setCropIndex(index);
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (cropIndex !== null) {
        const newImages = [...images];
        newImages[cropIndex] = imageUrl;
        onImagesChange(newImages);
      }
    };
    reader.readAsDataURL(croppedImageBlob);
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
          Upload up to {maxImages} images. Drag and drop or click to select files.
        </p>
      </div>

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
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
                  console.log('Upload button clicked, fileInputRef:', fileInputRef.current);
                  fileInputRef.current?.click();
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Click to upload
              </button>
              <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
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
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(index)}
                />
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleImageClick(index)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    title="Edit image"
                  >
                    <Camera size={16} className="text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
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
          <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p>No images uploaded yet</p>
          {required && (
            <p className="text-sm text-red-500 mt-1">At least one image is required</p>
          )}
        </div>
      )}

      {/* Image Crop Modal */}
      {selectedImage && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setSelectedImage(null);
            setCropIndex(null);
          }}
          onCrop={handleCropComplete}
          imageSrc={selectedImage}
        />
      )}
    </div>
  );
}
