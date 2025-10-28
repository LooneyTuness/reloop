import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export default function SummaryCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  className = '' 
}: CardProps) {
  const changeColor = {
    positive: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    negative: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50'
  };

  const getTrendIcon = () => {
    if (changeType === 'positive') return '↗️';
    if (changeType === 'negative') return '↘️';
    return '→';
  };

  return (
    <div className={`group bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-800 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${changeColor[changeType]}`}>
          <span className="mr-1">{getTrendIcon()}</span>
          {change}
        </div>
      )}
    </div>
  );
}
