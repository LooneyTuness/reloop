import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ZeroStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function ZeroState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  className = ''
}: ZeroStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center ${className}`}>
      {/* Icon Container */}
      <div className="mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm sm:max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center w-full">
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors w-full sm:w-auto"
          >
            {actionLabel}
          </button>
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors w-full sm:w-auto"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
