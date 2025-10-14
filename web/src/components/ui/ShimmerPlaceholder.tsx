import React from 'react';

interface ShimmerPlaceholderProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export default function ShimmerPlaceholder({
  className = '',
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  rounded = true
}: ShimmerPlaceholderProps) {
  const shimmerClass = `
    bg-gradient-to-r 
    from-gray-200 
    via-gray-300 
    to-gray-200 
    bg-[length:200%_100%] 
    animate-shimmer
    ${height} 
    ${width} 
    ${rounded ? 'rounded' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (lines === 1) {
    return <div className={shimmerClass} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`${shimmerClass} ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Specific shimmer components for common use cases
export function ShimmerCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <ShimmerPlaceholder className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <ShimmerPlaceholder className="h-4 w-3/4 mb-2" />
          <ShimmerPlaceholder className="h-3 w-1/2" />
        </div>
      </div>
      <ShimmerPlaceholder lines={2} className="mb-4" />
      <div className="flex justify-between items-center">
        <ShimmerPlaceholder className="h-6 w-20" />
        <ShimmerPlaceholder className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function ShimmerTable({ rows = 3, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <ShimmerPlaceholder
              key={colIndex}
              className={`flex-1 ${colIndex === 0 ? 'w-1/3' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ShimmerMetricCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <ShimmerPlaceholder className="h-8 w-8 rounded-lg" />
        <ShimmerPlaceholder className="h-4 w-16" />
      </div>
      <ShimmerPlaceholder className="h-8 w-20 mb-2" />
      <ShimmerPlaceholder className="h-4 w-24" />
    </div>
  );
}

