"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, User, Mail, Store, Globe, CheckCircle } from "lucide-react";

export default function SellerApplicationPage() {
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
          language: 'en' // Default to English for now
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
    <div className="min-h-screen bg-gray-50bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900text-white mb-3">
            Apply to Sell on vtoraraka.mk
          </h1>
          <p className="text-lg text-gray-600text-gray-400">
            We work with selected sellers who align with our values and product quality. Fill out the form below, and we'll get in touch if it's a good fit.
          </p>
        </div>

        {/* Application Form */}
        <Card className="border-0 shadow-sm bg-whitebg-gray-800">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900text-white">
              <FileText className="w-6 h-6 text-blue-600" />
              Seller Application Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700text-gray-300">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700text-gray-300">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-green-600" />
                  Business Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-sm font-medium text-gray-700text-gray-300">
                      Store Name or Brand Name
                    </Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="storeName"
                        name="storeName"
                        type="text"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your store name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteSocial" className="text-sm font-medium text-gray-700text-gray-300">
                      Website / Social Media
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="websiteSocial"
                        name="websiteSocial"
                        type="text"
                        value={formData.websiteSocial}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Instagram, Website, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Product Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="productDescription" className="text-sm font-medium text-gray-700text-gray-300">
                    Tell us about your products *
                  </Label>
                  <textarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-whitebg-gray-800 text-gray-900text-white placeholder-gray-500placeholder-gray-400"
                    placeholder="Briefly describe what you sell and why you want to join our platform..."
                    required
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-6">
                <div className="flex items-start space-x-3 p-4 bg-gray-50bg-gray-800/50 rounded-lg border border-gray-200border-gray-700">
                  <input
                    type="checkbox"
                    name="understandsApplication"
                    checked={formData.understandsApplication}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <div className="flex-1">
                    <Label htmlFor="understandsApplication" className="text-sm text-gray-700text-gray-300 cursor-pointer">
                      I understand this is an application and not all requests are accepted. I agree to the terms and conditions.
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Submit Application
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200border-gray-700 mt-8">
              <p className="text-sm text-gray-600text-gray-400 mb-2">
                Already invited to sell?
              </p>
            <a
              href="/sign-in?redirect=/seller-dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm underline transition-colors"
            >
              Log in to your seller account here
            </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
