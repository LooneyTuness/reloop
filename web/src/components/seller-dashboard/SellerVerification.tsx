'use client';

import React from 'react';

interface SellerVerificationProps {
  children: React.ReactNode;
}

export default function SellerVerification({ children }: SellerVerificationProps) {
  // No authentication required - always show dashboard
  return <>{children}</>;
}
