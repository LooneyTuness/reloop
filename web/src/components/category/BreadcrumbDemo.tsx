'use client';

import React from 'react';
import CategoryBreadcrumbs, { CategoryBreadcrumbsCompact, CategoryBreadcrumbsText } from './CategoryBreadcrumbs';
import { CategoryBreadcrumb } from '@/types/category';

// Demo data showing different category levels
const demoBreadcrumbs: CategoryBreadcrumb[] = [
  {
    id: '1',
    name: 'Women',
    slug: 'women',
    level: 0,
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'women-clothing',
    level: 1,
  },
  {
    id: '3',
    name: 'Dresses',
    slug: 'women-clothing-dresses',
    level: 2,
  },
];

const deepBreadcrumbs: CategoryBreadcrumb[] = [
  {
    id: '1',
    name: 'Men',
    slug: 'men',
    level: 0,
  },
  {
    id: '2',
    name: 'Shoes',
    slug: 'men-shoes',
    level: 1,
  },
  {
    id: '3',
    name: 'Sneakers',
    slug: 'men-shoes-sneakers',
    level: 2,
  },
  {
    id: '4',
    name: 'Running',
    slug: 'men-shoes-sneakers-running',
    level: 3,
  },
];

export default function BreadcrumbDemo() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Enhanced Breadcrumbs Demo</h1>
        
        {/* Default Variant */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Default Variant</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">3-level breadcrumb:</p>
              <CategoryBreadcrumbs breadcrumbs={demoBreadcrumbs} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">4-level breadcrumb:</p>
              <CategoryBreadcrumbs breadcrumbs={deepBreadcrumbs} />
            </div>
          </div>
        </div>

        {/* Minimal Variant */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Minimal Variant</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">3-level breadcrumb:</p>
              <CategoryBreadcrumbs breadcrumbs={demoBreadcrumbs} variant="minimal" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">4-level breadcrumb:</p>
              <CategoryBreadcrumbs breadcrumbs={deepBreadcrumbs} variant="minimal" />
            </div>
          </div>
        </div>

        {/* Compact Variant */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Compact Variant (Mobile)</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">3-level breadcrumb:</p>
              <CategoryBreadcrumbsCompact breadcrumbs={demoBreadcrumbs} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">4-level breadcrumb (shows first + last 2):</p>
              <CategoryBreadcrumbsCompact breadcrumbs={deepBreadcrumbs} />
            </div>
          </div>
        </div>

        {/* Text Variant */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Text Variant (No Links)</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">With level styling:</p>
              <CategoryBreadcrumbsText breadcrumbs={demoBreadcrumbs} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Without level styling:</p>
              <CategoryBreadcrumbsText breadcrumbs={demoBreadcrumbs} showLevels={false} />
            </div>
          </div>
        </div>

        {/* Level-based Styling Demo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Level-based Styling</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="text-gray-600 font-medium">Level 0 (Main Category):</span> Darker text, medium weight</p>
            <p><span className="text-gray-500">Level 1 (Subcategory):</span> Medium text color</p>
            <p><span className="text-gray-400">Level 2+ (Type):</span> Lighter text color</p>
            <p><span className="text-gray-900 font-semibold">Current Page:</span> Darkest text, semibold weight</p>
          </div>
        </div>
      </div>
    </div>
  );
}
