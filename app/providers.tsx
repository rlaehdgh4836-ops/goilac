'use client';

import { ThemeProvider } from '@montage-ui/core';
import { AppRouterCacheProvider } from '@montage-ui/nextjs';

import { CheckoutProvider } from '@/lib/checkout-store';

import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AppRouterCacheProvider>
        <CheckoutProvider>{children}</CheckoutProvider>
      </AppRouterCacheProvider>
    </ThemeProvider>
  );
}
