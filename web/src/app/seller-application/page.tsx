"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, User, Mail, Home, Globe, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SellerApplicationPage() {
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
          language: language || 'en' // Use current language
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Application submitted successfully!");
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
        toast.error(result.error || "Error submitting application");
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Error submitting application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.fullName && formData.email && formData.productDescription && formData.understandsApplication;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-6 sm:pt-24 sm:pb-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            {t("applyToSellTitle")}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t("sellerApplicationDescription")}
          </p>
        </div>

        {/* Application Form */}
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              <span className="break-words">{t("sellerApplicationForm")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <span className="break-words">{t("personalInformation")}</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("fullNameRequired")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10 h-11 sm:h-12 text-base border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("yourFullName")}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("emailAddressRequired")}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-11 sm:h-12 text-base border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("emailPlaceholder")}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="break-words">{t("businessInformation")}</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("homeNameOrBrand")}
                    </Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="storeName"
                        name="storeName"
                        type="text"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        className="pl-10 h-11 sm:h-12 text-base border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("yourStoreName")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteSocial" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("websiteSocialMedia")}
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="websiteSocial"
                        name="websiteSocial"
                        type="text"
                        value={formData.websiteSocial}
                        onChange={handleInputChange}
                        className="pl-10 h-11 sm:h-12 text-base border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("instagramWebsiteEtc")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description Section */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                  <span className="break-words">{t("productInformation")}</span>
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="productDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("tellUsAboutProducts")}
                  </Label>
                  <textarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 text-base border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[100px]"
                    placeholder={t("describeProductsPlaceholder")}
                    required
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    name="understandsApplication"
                    checked={formData.understandsApplication}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                    required
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="understandsApplication" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed block">
                      {t("termsAndConditions")}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-6 rounded-lg font-medium text-base focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] min-h-[48px] sm:min-h-[52px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">{t("submittingApplication")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{t("submitApplication")}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 mt-6 sm:mt-8 px-4 sm:px-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                {t("alreadyInvitedToSell")}
              </p>
              <a
                href="/sign-in?redirect=/seller-dashboard"
                className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm underline transition-colors hover:no-underline break-words"
              >
                {t("logInToSellerAccount")}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
