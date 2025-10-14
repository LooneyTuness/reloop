"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface SellerApplicationFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function SellerApplicationForm({ onSuccess, onClose }: SellerApplicationFormProps) {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    storeName: "",
    websiteSocial: "",
    productDescription: "",
    understandsApplication: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/seller-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: language
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || t("applicationSubmitted"));
        if (onSuccess) {
          onSuccess();
        }
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          storeName: "",
          websiteSocial: "",
          productDescription: "",
          understandsApplication: false,
        });
      } else {
        toast.error(result.error || t("applicationError"));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(t("applicationError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.fullName && formData.email && formData.productDescription && formData.understandsApplication;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("applyToSellTitle")}
              </h2>
              <p className="text-gray-600 mt-1">
                {t("sellerApplicationDescription")}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={t("close")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              {t("fullName")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={t("yourName")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t("emailAddress")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Store Name */}
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
              {t("storeNameLabel")}
              <span className="text-gray-500 text-sm ml-1">
                ({t("optional")})
              </span>
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder={t("storeNamePlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Website/Social Media */}
          <div>
            <label htmlFor="websiteSocial" className="block text-sm font-medium text-gray-700 mb-2">
              {t("websiteSocialLabel")}
              <span className="text-gray-500 text-sm ml-1">
                ({t("optional")})
              </span>
            </label>
            <input
              type="text"
              id="websiteSocial"
              name="websiteSocial"
              value={formData.websiteSocial}
              onChange={handleInputChange}
              placeholder={t("websiteSocialPlaceholder")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
              {t("productDescriptionLabel")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              placeholder={t("productDescriptionPlaceholder")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
              required
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="understandsApplication"
              name="understandsApplication"
              checked={formData.understandsApplication}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="understandsApplication" className="text-sm text-gray-700">
              {t("understandsApplicationText")}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting 
                ? t("submittingApplication")
                : t("submitApplication")
              }
            </button>
            
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                {t("cancel")}
              </button>
            )}
          </div>

          {/* Already Invited Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {t("alreadyInvited")}
            </p>
            <a
              href="/sign-in"
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm underline"
            >
              {t("loginToSellerAccount")}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
