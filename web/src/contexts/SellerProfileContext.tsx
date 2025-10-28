'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface SellerProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'seller';
  is_approved: boolean;
  full_name?: string;
  business_name?: string;
  business_type?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  tax_id?: string;
  bank_account?: string;
  created_at: string;
  updated_at: string;
}

interface SellerProfileContextType {
  profile: SellerProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<SellerProfile>) => Promise<boolean>;
}

const SellerProfileContext = createContext<SellerProfileContextType | undefined>(undefined);

export function useSellerProfile() {
  const context = useContext(SellerProfileContext);
  if (context === undefined) {
    throw new Error('useSellerProfile must be used within a SellerProfileProvider');
  }
  return context;
}

interface SellerProfileProviderProps {
  children: React.ReactNode;
}

export function SellerProfileProvider({ children }: SellerProfileProviderProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: profileError } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // No profile found
          setError('No seller profile found');
          setProfile(null);
        } else {
          throw profileError;
        }
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching seller profile:', err);
      setError('Failed to load seller profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<SellerProfile>): Promise<boolean> => {
    if (!user || !profile) return false;

    try {
      // Filter out undefined values and create update object
      const updateData: Record<string, string | boolean | undefined> = {};
      
      if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
      if (updates.business_name !== undefined) updateData.business_name = updates.business_name;
      if (updates.business_type !== undefined) updateData.business_type = updates.business_type;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.website !== undefined) updateData.website = updates.website;
      if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
      if (updates.tax_id !== undefined) updateData.tax_id = updates.tax_id;
      if (updates.bank_account !== undefined) updateData.bank_account = updates.bank_account;
      
      updateData.updated_at = new Date().toISOString();

      const { data, error: updateError } = await (supabase
        .from('seller_profiles')
        .update(updateData as never)
        .eq('user_id', user.id)
        .select()
        .single());

      if (updateError) {
        console.error('Error updating seller profile:', updateError);
        return false;
      }

      setProfile(data as SellerProfile);
      return true;
    } catch (err) {
      console.error('Error updating seller profile:', err);
      return false;
    }
  }, [user, profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Memoize the context value to prevent unnecessary rerenders
  const value = useMemo(() => ({
    profile,
    loading,
    error,
    refreshProfile,
    updateProfile,
  }), [profile, loading, error, refreshProfile, updateProfile]);

  return (
    <SellerProfileContext.Provider value={value}>
      {children}
    </SellerProfileContext.Provider>
  );
}
