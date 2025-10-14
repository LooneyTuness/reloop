'use client';

import React, { useState, useEffect } from 'react';
import { supabaseDataService } from '@/lib/supabase/data-service';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { User, Mail, Phone, MapPin, Globe, Save, Upload, Camera } from 'lucide-react';
import ImageCropModal from './ImageCropModal';

interface SellerProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'seller';
  is_approved: boolean;
  full_name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  business_name?: string;
  business_type?: string;
  tax_id?: string;
  bank_account?: string;
  created_at: string;
  updated_at: string;
}

export default function SellerProfileManager() {
  const { user } = useAuth();
  const { updateAvatar } = useProfile();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    business_name: '',
    business_type: '',
    tax_id: '',
    bank_account: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const profileData = await supabaseDataService.getSellerProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          email: profileData.email || user.email || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          website: profileData.website || '',
          business_name: profileData.business_name || '',
          business_type: profileData.business_type || '',
          tax_id: profileData.tax_id || '',
          bank_account: profileData.bank_account || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await supabaseDataService.updateSellerProfile(user.id, formData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setSelectedImage(imageUrl);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user?.id) return;

    try {
      // Convert blob to data URL for display
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        
        // In a real app, you would upload the blob to Supabase Storage
        // For now, we'll use the data URL directly
        await supabaseDataService.updateSellerProfile(user.id, { avatar_url: imageUrl });
        setProfile(prev => prev ? { ...prev, avatar_url: imageUrl } : null);
        updateAvatar(imageUrl);
        setSuccess('Profile picture updated!');
      };
      reader.readAsDataURL(croppedImageBlob);
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      setError('Failed to update profile picture');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Seller Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your seller profile and business information
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h2>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mx-auto mb-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the camera icon to upload a new picture
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell customers about yourself..."
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Type
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select business type</option>
                    <option value="individual">Individual Seller</option>
                    <option value="small_business">Small Business</option>
                    <option value="retailer">Retailer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tax ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Account (Optional)
                  </label>
                  <input
                    type="text"
                    name="bank_account"
                    value={formData.bank_account}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter bank account info"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Crop Modal */}
      {selectedImage && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setSelectedImage(null);
          }}
          onCrop={handleCropComplete}
          imageSrc={selectedImage}
        />
      )}
    </div>
  );
}
