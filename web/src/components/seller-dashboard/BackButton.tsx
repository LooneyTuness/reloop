'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

export default function BackButton({ 
  href = '/seller-dashboard', 
  onClick, 
  className = '',
  showText = true 
}: BackButtonProps) {
  const router = useRouter();
  const { t } = useDashboardLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${className}`}
      title={t('backToDashboard')}
    >
      <ArrowLeft size={16} />
      {showText && <span>{t('back')}</span>}
    </button>
  );
}
