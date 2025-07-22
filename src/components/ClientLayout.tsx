"use client";

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/createEmotionCache';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const clientSideEmotionCache = createEmotionCache();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Header />
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
} 