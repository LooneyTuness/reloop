'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import SimpleImageUpload from '@/components/seller-dashboard/SimpleImageUpload';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import CategorySelector from '@/components/category/CategorySelector';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { CategoryWithChildren } from '@/types/category';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';
// BrandDropdown removed - using simple text input instead

function AddProductContent() {
  const router = useRouter();
  const { addNewProduct } = useDashboard();
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
        images: images // Use uploaded images instead of placeholder
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
    <div className="px-3 sm:px-6 py-4 sm:py-8 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 hover:gap-3 transition-all group rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {t('back')}
          </button>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('addNewProduct')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('createNewProductListing')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-900 p-8">
            <SimpleImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
              required={true}
            />
          </div>

          {/* Product Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('productDetails') || 'Product Details'}
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {t('productName')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('enterProductName')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('describeYourProduct')}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('priceMKD')} <span className="text-red-500">*</span>
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
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('category')} <span className="text-red-500">*</span>
                  </label>
                  <CategorySelector
                    onCategorySelect={handleCategorySelect}
                    selectedCategory={selectedCategory}
                    placeholder={t('selectCategory')}
                    required={true}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="condition" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('condition')}
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="excellent">{t('excellent')}</option>
                    <option value="good">{t('good')}</option>
                    <option value="fair">{t('fair')}</option>
                    <option value="poor">{t('poor')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="size" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('size')}
                  </label>
                  <input
                    id="size"
                    name="size"
                    type="text"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder={t('sizePlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="brand" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('brand')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder={t('brandPlaceholder') || 'Enter brand name'}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('quantity')}
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="status" className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {t('status')}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="active">{t('active')}</option>
                    <option value="draft">{t('draft')}</option>
                    <option value="inactive">{t('inactive')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  {t('creating')}
                </>
              ) : (
                <>
                  <Save size={20} />
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
    <SellerDashboardLayout>
      <DashboardProvider>
        <CategoryProvider>
          <DashboardLanguageProvider>
            <AddProductContent />
          </DashboardLanguageProvider>
        </CategoryProvider>
      </DashboardProvider>
    </SellerDashboardLayout>
  );
}