'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';

// Demo component to add sample notifications
export default function NotificationDemo() {
  const { addNotification, notifications } = useNotifications();
  const [hasAddedDemoNotifications, setHasAddedDemoNotifications] = useState(false);

  useEffect(() => {
    // Check if demo notifications have already been added
    const demoAdded = localStorage.getItem('demo-notifications-added');
    
    // Only add demo notifications if we haven't added them yet and there are no existing notifications
    if (!demoAdded && !hasAddedDemoNotifications && notifications.length === 0) {
      const sampleNotifications = [
        {
          type: 'order' as const,
          title: 'New Order Received',
          message: 'You have received a new order for "Vintage Denim Jacket"',
          actionUrl: '/seller-dashboard/orders'
        },
        {
          type: 'product' as const,
          title: 'Product Approved',
          message: 'Your listing "Designer Handbag" has been approved and is now live',
          actionUrl: '/seller-dashboard/listings'
        },
        {
          type: 'payment' as const,
          title: 'Payment Processed',
          message: 'Payment of $45.00 has been processed for your recent sale',
          actionUrl: '/seller-dashboard/payouts'
        },
        {
          type: 'system' as const,
          title: 'Welcome to Seller Dashboard',
          message: 'Complete your profile setup to start selling',
          actionUrl: '/seller-dashboard/settings'
        }
      ];

      // Add notifications with a delay to simulate real-time updates
      sampleNotifications.forEach((notification, index) => {
        setTimeout(() => {
          addNotification(notification);
        }, index * 2000); // Add each notification 2 seconds apart
      });

      setHasAddedDemoNotifications(true);
      localStorage.setItem('demo-notifications-added', 'true');
    }
  }, [addNotification, notifications.length, hasAddedDemoNotifications]);

  return null; // This component doesn't render anything
}
