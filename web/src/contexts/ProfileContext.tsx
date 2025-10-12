'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseDataService } from '@/lib/supabase/data-service';

interface ProfileContextType {
  avatarUrl: string | null;
  updateAvatar: (url: string) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProfileAvatar();
    } else {
      setAvatarUrl(null);
      setIsLoading(false);
    }
  }, [user?.id]);

  const loadProfileAvatar = async () => {
    try {
      setIsLoading(true);
      const profile = await supabaseDataService.getSellerProfile(user.id);
      setAvatarUrl(profile?.avatar_url || null);
    } catch (error) {
      console.error('Error loading profile avatar:', error);
      setAvatarUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <ProfileContext.Provider
      value={{
        avatarUrl,
        updateAvatar,
        isLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
