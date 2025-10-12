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
        toast.success(result.message || (language === "mk" ? "Апликацијата е успешно поднесена!" : "Application submitted successfully!"));
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
        toast.error(result.error || (language === "mk" ? "Грешка при поднесување на апликацијата" : "Error submitting application"));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(language === "mk" ? "Грешка при поднесување на апликацијата" : "Error submitting application");
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
                {language === "mk" ? "Аплицирај за продавање на vtoraraka.mk" : "Apply to Sell on vtoraraka.mk"}
              </h2>
              <p className="text-gray-600 mt-1">
                {language === "mk" 
                  ? "Работиме со селектирани продавачи кои се усогласуваат со нашите вредности и квалитет на производи. Пополни ја формата подолу, и ќе те контактираме ако има соодветност."
                  : "We work with selected sellers who align with our values and product quality. Fill out the form below, and we'll get in touch if it's a good fit."
                }
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={language === "mk" ? "Затвори" : "Close"}
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
              {language === "mk" ? "Име и презиме" : "Full Name"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={language === "mk" ? "Вашето име" : "Your name"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {language === "mk" ? "Е-пошта" : "Email Address"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={language === "mk" ? "ваша@е-пошта.com" : "you@example.com"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Store Name */}
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
              {language === "mk" ? "Име на продавница или бренд" : "Store Name or Brand Name"}
              <span className="text-gray-500 text-sm ml-1">
                ({language === "mk" ? "опционално" : "optional"})
              </span>
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder={language === "mk" ? "Име на вашата продавница" : "Your store name"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Website/Social Media */}
          <div>
            <label htmlFor="websiteSocial" className="block text-sm font-medium text-gray-700 mb-2">
              {language === "mk" ? "Веб-сајт / Социјални мрежи" : "Website / Social Media"}
              <span className="text-gray-500 text-sm ml-1">
                ({language === "mk" ? "опционално" : "optional"})
              </span>
            </label>
            <input
              type="text"
              id="websiteSocial"
              name="websiteSocial"
              value={formData.websiteSocial}
              onChange={handleInputChange}
              placeholder={language === "mk" ? "Instagram, веб-сајт, итн." : "Instagram, Website, etc."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
              {language === "mk" ? "Кажи ни за вашите производи" : "Tell us about your products"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              placeholder={language === "mk" ? "Опишете што продавате и зошто сакате да се придружите" : "Briefly describe what you sell and why you want to join"}
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
              {language === "mk" 
                ? "Разбирам дека ова е апликација и не сите барања се прифатени."
                : "I understand this is an application and not all requests are accepted."
              }
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
                ? (language === "mk" ? "Се поднесува апликацијата..." : "Submitting Application...")
                : (language === "mk" ? "Поднеси апликација" : "Submit Application")
              }
            </button>
            
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                {language === "mk" ? "Откажи" : "Cancel"}
              </button>
            )}
          </div>

          {/* Already Invited Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {language === "mk" ? "Веќе поканет за продавање?" : "Already invited to sell?"}
            </p>
            <a
              href="/sign-in"
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm underline"
            >
              {language === "mk" ? "Најави се на твојата продавачка сметка тука" : "Log in to your seller account here"}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
