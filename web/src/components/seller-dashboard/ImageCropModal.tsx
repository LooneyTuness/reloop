'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCw } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedImageBlob: Blob) => void;
  imageSrc: string;
}

export default function ImageCropModal({ isOpen, onClose, onCrop, imageSrc }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [isMobile, setIsMobile] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768 || 
                            'ontouchstart' in window;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    
    console.log('Image loaded:', { width, height, aspect });
    
    // Ensure we have valid dimensions
    if (width === 0 || height === 0) {
      console.log('Invalid image dimensions:', { width, height });
      return;
    }
    
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect || 1,
        width,
        height
      ),
      width,
      height
    );
    
    console.log('Setting initial crop:', crop);
    setCrop(crop);
    
    // Also set completed crop to enable the button
    const pixelCrop = {
      x: (crop.x / 100) * width,
      y: (crop.y / 100) * height,
      width: (crop.width / 100) * width,
      height: (crop.height / 100) * height,
      unit: 'px' as const
    };
    console.log('Setting initial completed crop:', pixelCrop);
    setCompletedCrop(pixelCrop);
  }

  function onDownloadCropClick() {
    console.log('onDownloadCropClick called', { 
      completedCrop: !!completedCrop, 
      canvas: !!canvasRef.current, 
      img: !!imgRef.current,
      isMobile,
      userAgent: navigator.userAgent
    });
    
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      console.log('Missing required elements for crop:', { completedCrop, canvas: !!canvasRef.current, img: !!imgRef.current });
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    // Ensure image is fully loaded
    if (!image.complete || image.naturalWidth === 0) {
      console.log('Image not fully loaded');
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('No 2d context available');
      return;
    }

    // Use a more conservative pixel ratio for mobile devices
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      canvas.toBlob((blob) => {
        if (blob) {
          onCrop(blob);
          onClose();
        } else {
          console.error('Failed to create blob from canvas');
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error drawing image to canvas:', error);
    }
  }

  const handleRotate = () => {
    setRotate(prev => (prev + 90) % 360);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" style={{ touchAction: 'none' }}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ touchAction: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Crop Profile Picture
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Crop Area */}
            <div className="flex-1">
              <div className="relative max-h-96 overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => {
                    console.log('Crop changed:', percentCrop);
                    setCrop(percentCrop);
                  }}
                  onComplete={(c) => {
                    console.log('Crop completed:', c);
                    setCompletedCrop(c);
                  }}
                  aspect={aspect}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxHeight: '400px',
                      maxWidth: '100%',
                      touchAction: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                    onLoad={onImageLoad}
                    className="max-w-full h-auto"
                    draggable={false}
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:w-80 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scale
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">{Math.round(scale * 100)}%</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rotate
                </label>
                <button
                  onClick={handleRotate}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RotateCw size={16} />
                  Rotate 90°
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aspect Ratio
                </label>
                <select
                  value={aspect || 'free'}
                  onChange={(e) => setAspect(e.target.value === 'free' ? undefined : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="free">Free</option>
                  <option value="1">1:1 (Square)</option>
                  <option value="4/3">4:3</option>
                  <option value="16/9">16:9</option>
                </select>
              </div>

              <div className="pt-4">
                {!completedCrop && (
                  <div className="text-sm text-gray-500 mb-2">
                    Please select a crop area to enable the Apply Crop button
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked!', { completedCrop, isMobile });
                    if (completedCrop) {
                      onDownloadCropClick();
                    }
                  }}
                  disabled={!completedCrop}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    completedCrop 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: isMobile ? '48px' : 'auto',
                    fontSize: isMobile ? '16px' : '14px',
                    pointerEvents: 'auto',
                    zIndex: 10
                  }}
                >
                  <Check size={isMobile ? 18 : 16} />
                  Apply Crop {completedCrop ? '✓' : '✗'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden canvas for processing */}
        <canvas
          ref={canvasRef}
          style={{
            display: 'none',
          }}
        />
      </div>
    </div>
  );
}
