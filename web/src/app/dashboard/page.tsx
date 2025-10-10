"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/supabase.browser';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface ItemRow {
  id: string;
  title: string;
  price: number;
  description: string | null;
  size: string | null;
  category: string | null;
  is_active?: boolean | null; // optional if column doesn't exist yet
  created_at?: string | null;
  photos?: string[]; // uploaded photo URLs
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  const fetchItems = useCallback(async (sellerId: string) => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        toast.error(t("failedToLoadItems"));
        return;
      }

      setItems((data as ItemRow[]) || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error(t("failedToLoadItems"));
    }
  }, [t]);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/sign-in');
        return;
      }
      
      setUser(user);
      await fetchItems(user.id);
      setLoading(false);
    };

    checkUser();
  }, [router, fetchItems]);

  const toggleItemStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('items')
        // @ts-expect-error - is_active field may not be in types yet
        .update({ is_active: !currentStatus })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating item:', error);
        toast.error(t("failedToUpdateItem"));
        return;
      }

      setItems(items.map(p => 
        p.id === itemId ? { ...p, is_active: !currentStatus } : p
      ));
      
      toast.success(t(!currentStatus ? "itemActivated" : "itemDeactivated"));
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error(t("failedToUpdateItem"));
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting item:', error);
        toast.error(t("failedToDeleteItem"));
        return;
      }

      setItems(items.filter(p => p.id !== itemId));
      toast.success(t("itemDeleted"));
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(t("failedToDeleteItem"));
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="professional-card p-8 max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">{t("loadingDashboard")}</p>
            <p className="text-sm text-gray-600">{t("pleaseWait")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="professional-card p-6 animate-fade-in-up">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("totalItems")}</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="professional-card p-6 animate-fade-in-up delay-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("activeItems")}</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(p => !!p.is_active).length}</p>
              </div>
            </div>
          </div>

          <div className="professional-card p-6 animate-fade-in-up delay-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("inactiveItems")}</p>
                <p className="text-2xl font-bold text-gray-900">{items.filter(p => p.is_active === false).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6 animate-fade-in-up delay-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t("yourItems")}</h2>
            {user?.user_metadata?.full_name && (
              <p className="text-sm text-gray-600">{t("welcomeBack")}, {user.user_metadata.full_name}</p>
            )}
          </div>
          <Button
            onClick={() => router.push('/sell')}
            variant="primary"
            className=""
          >
            {t("addNewProduct")}
          </Button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="professional-card p-12 text-center animate-fade-in-up delay-400">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("noProductsYet")}</h3>
            <p className="text-gray-600 mb-8">{t("startByAdding")}</p>
            <Button
              onClick={() => router.push('/sell')}
              variant="primary"
              className=""
            >
              {t("addYourFirstProduct")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div key={item.id} className={`professional-card overflow-hidden animate-fade-in-up delay-${Math.min(index * 100, 500)}`}>
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {item.photos && item.photos.length > 0 ? (
                    <Image
                      src={item.photos[0]}
                      alt={item.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <span className={`px-3 py-1 text-xs rounded-lg font-medium ${
                      item.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.is_active ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.size || '—'}</p>
                  <p className="text-lg font-bold text-gray-900 mb-4">{item.price} MKD</p>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => toggleItemStatus(item.id, !!item.is_active)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {item.is_active ? t("deactivate") : t("activate")}
                    </Button>
                    <Button
                      onClick={() => deleteItem(item.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
