'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import SimpleImageUpload from '@/components/seller-dashboard/SimpleImageUpload';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { CategoryProvider, useCategory } from '@/contexts/CategoryContext';
import CategorySelector from '@/components/category/CategorySelector';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { CategoryHierarchy, CategoryWithChildren } from '@/types/category';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';

function AddProductContent() {
  const router = useRouter();
  const { addNewProduct } = useDashboard();
  const { getCategoryById } = useCategory();
  const { t } = useDashboardLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    category_id: '',
    condition: 'excellent',
    size: '',
    brand: '',
    quantity: '1',
    status: 'active'
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithChildren | null>(null);
  
  // Debug: Log when images change
  React.useEffect(() => {
    console.log('Images state updated:', images);
  }, [images]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category: CategoryWithChildren | null) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      category: category ? category.name : '',
      category_id: category ? category.id : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one image is uploaded
    if (images.length === 0) {
      toast.error(t('pleaseUploadAtLeastOneImage'));
      return;
    }
    
    // Validate that brand is provided
    if (!formData.brand || formData.brand.trim() === '') {
      toast.error(t('pleaseProvideBrand'));
      return;
    }
    
    setIsLoading(true);
    try {
      const productData = {
        name: formData.name,
        title: formData.name, // Also set title for compatibility
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        condition: formData.condition,
        size: formData.size || null,
        brand: formData.brand.trim(),
        quantity: parseInt(formData.quantity),
        status: formData.status,
        photos: images // Use uploaded images instead of placeholder
      };

      await addNewProduct(productData);
      toast.success(t('productCreatedSuccessfully'));
      router.push('/seller-dashboard/listings');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(t('failedToCreateProduct'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('back')}
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('addNewProduct')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('createNewProductListing')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Image Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <SimpleImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
              required={true}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('productName')} *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('enterProductName')}
                  required
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('describeYourProduct')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('priceMKD')} *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <CategorySelector
                    onCategorySelect={handleCategorySelect}
                    selectedCategory={selectedCategory}
                    placeholder={t('selectCategory')}
                    required={true}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('condition')}
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="excellent">{t('excellent')}</option>
                    <option value="good">{t('good')}</option>
                    <option value="fair">{t('fair')}</option>
                    <option value="poor">{t('poor')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('size')}
                  </label>
                  <input
                    id="size"
                    name="size"
                    type="text"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder={t('sizePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('brand')} *
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder={t('brandPlaceholder')}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('quantity')}
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('status')}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">{t('active')}</option>
                    <option value="draft">{t('draft')}</option>
                    <option value="inactive">{t('inactive')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('creating')}
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {t('createProduct')}
                </>
              )}
            </button>
        </div>
      </form>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <DashboardProvider>
      <CategoryProvider>
        <DashboardLanguageProvider>
          <SellerDashboardLayout>
            <AddProductContent />
          </SellerDashboardLayout>
        </DashboardLanguageProvider>
      </CategoryProvider>
    </DashboardProvider>
  );
}