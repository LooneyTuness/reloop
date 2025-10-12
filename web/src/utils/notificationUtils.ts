// Utility function to reset demo notifications
// Call this in browser console if you want to reset: resetDemoNotifications()
export function resetDemoNotifications() {
  localStorage.removeItem('demo-notifications-added');
  localStorage.removeItem('seller-notifications');
  console.log('Demo notifications reset! Refresh the page to see them again.');
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetDemoNotifications = resetDemoNotifications;
}
