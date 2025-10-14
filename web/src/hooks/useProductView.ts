import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface UseProductViewOptions {
  productId?: string;
  enabled?: boolean;
}

export function useProductView({ productId, enabled = true }: UseProductViewOptions) {
  const pathname = usePathname();
  const hasTracked = useRef(false);
  const sessionId = useRef<string | null>(null);

  // Generate session ID if not exists
  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !productId || hasTracked.current) return;

    // Only track on product detail pages
    if (!pathname.includes('/products/') || !pathname.includes(productId)) return;

    const trackView = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId.current,
            referrer: document.referrer || window.location.href,
          }),
        });

        if (response.ok) {
          hasTracked.current = true;
          console.log(`✅ Tracked view for product ${productId}`);
        } else {
          console.error('Failed to track product view:', response.statusText);
        }
      } catch (error) {
        console.error('Error tracking product view:', error);
      }
    };

    // Track view after a short delay to ensure user actually viewed the page
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [productId, enabled, pathname]);

  return {
    sessionId: sessionId.current,
  };
}

